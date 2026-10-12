'use client';
import { useState, useRef } from 'react';
import { X, Check, LockKeyhole } from 'lucide-react';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';
import ReactDOMServer from 'react-dom/server';
import { isString } from 'lodash';
import useVersions from '@/hooks/useVersions';
import { ArticleModel } from '@/types/models/ArticleModel';

type ContentEditableProps = {
  data?: ArticleModel;
  children?: React.ReactNode;
  showLockedByTooltip?: boolean;
  viewStatus?: 'LIVE' | 'PREVIEW';
  minimal?: boolean;
};

const ContentEditable: React.FC<ContentEditableProps> = ({
  data,
  children,
  showLockedByTooltip = true,
  viewStatus,
  minimal,
}) => {
  const articleId = data?.id;

  // NEON-2129
  const lockedBy = data?.sys?.lockedBy === 'CollaborationEditor' ? null : data?.sys?.lockedBy;
  showLockedByTooltip = lockedBy ? true : false;
  const divRef = useRef<HTMLDivElement>(null);
  const divButtonsRef = useRef<HTMLDivElement>(null);
  //console.log('data in contentEditable', data);

  const { changeEdited, refetch: refetchVersions } = useVersions({
    currentNode: data as any,
    viewStatus: viewStatus || 'PREVIEW',
    notLoadOnInit: minimal,
  }); // TODO: Replace 'any' with proper PageData<BaseModel> type conversion if available
  const { data: loggedUserInfo } = useLoggedUserInfo();

  const getContentHtml = () => {
    try {
      return ReactDOMServer.renderToStaticMarkup(children as React.ReactElement);
    } catch {
      return '';
    }
  };
  const [contentString, setContentString] = useState<string>(getContentHtml);
  const [previousContentString, setPreviousContentString] = useState<string>(getContentHtml);
  const key = new Date().toISOString() + Math.random().toString(36).substring(2, 15);

  const showDivButtons = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    divButtonsRef.current?.classList.remove('hidden');
  };

  const hideDivButtons = () => {
    divButtonsRef.current?.classList.add('hidden');
  };

  const handleUpdateContentItem = async (contentItemId: string, payload: string) => {
    try {
      const response = await fetch(`/api/contentItems`, {
        method: 'POST',
        body: JSON.stringify({ id: articleId, contentItemId: contentItemId, payload: payload }),
      });
      if (response.ok) {
        console.log('Content updated successfully');
        await refetchVersions(); // Refresh versions after successful update
        window.location.reload(); // Reload the page to reflect changes
      } else {
        alert('Failed to update content with articleId=' + articleId + '\nResponse status: ' + response.statusText);
        console.warn('Failed to update content - response:', response);
        window.location.reload(); // Reload the page if update fails
      }
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleSave = (event?: React.MouseEvent) => {
    event?.stopPropagation();

    if (divRef.current) {
      const firstChild = divRef.current?.firstChild as HTMLElement;
      const dataId = firstChild?.getAttribute('id') || '';
      const content = firstChild?.innerHTML;

      handleUpdateContentItem(dataId, content);
      setContentString(divRef?.current?.innerHTML);
      setPreviousContentString(divRef?.current?.innerHTML);
      changeEdited(true); // Mark as edited
      hideDivButtons(); // Hide buttons after save
      divRef.current?.blur(); // Remove focus from the div

      //setTimeout(() => {
      //  location.reload();
      //}, 400); // Reload the page to reflect changes
    }
  };

  const handleCancel = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (divRef.current) {
      divRef.current.innerHTML = previousContentString; // Reset to previous content
    }
    setContentString(previousContentString);
    hideDivButtons(); // Hide buttons after cancel
    divRef.current?.blur(); // Remove focus from the div
  };

  // Hide buttons when the contenteditable div loses focus
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (divRef.current && !divRef.current.contains(event.relatedTarget as Node)) {
      hideDivButtons();
    }
  };

  const isEditable = !!loggedUserInfo?.inspectItems && viewStatus !== 'LIVE' && !loggedUserInfo?.preview;

  return lockedBy ? (
    <div key={key} className="relative group">
      <div className="flex items-center">
        {children}
        {showLockedByTooltip && loggedUserInfo?.inspectItems && !loggedUserInfo?.preview && (
          <>
            <span
              className="ml-space-2xs relative"
              onMouseEnter={e => {
                const tooltip = e.currentTarget.nextSibling as HTMLDivElement;
                if (tooltip) tooltip.classList.remove('hidden');
              }}
              onMouseLeave={e => {
                const tooltip = e.currentTarget.nextSibling as HTMLDivElement;
                if (tooltip) tooltip.classList.add('hidden');
              }}
            >
              <LockKeyhole />
            </span>
            <div className="hidden px-space-2xs py-space-3xs rounded-sm bg-ink text-inverse text-caption whitespace-nowrap shadow-lg z-10">
              Locked by {isString(lockedBy) ? lockedBy : (lockedBy as any).userName}
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <div>
      <div
        key={key}
        ref={divRef}
        contentEditable={isEditable}
        suppressContentEditableWarning={isEditable}
        onClick={isEditable ? showDivButtons : undefined}
        onBlur={isEditable ? handleBlur : undefined}
        className={`relative rounded-sm z-10 ${
          isEditable ? 'border-1 border-neutral-light/30 hover:border-primary p-space-3xs cursor-text' : ''
        }`}
        {...(isEditable ? { dangerouslySetInnerHTML: { __html: contentString } } : {})}
        tabIndex={0}
      >
        {!isEditable && children}
      </div>
      {loggedUserInfo?.inspectItems && (
        <div className="relative">
          <div
            ref={divButtonsRef}
            className="bg-canvas z-20 flex absolute right-0 flex-row items-center justify-end rounded-sm shadow-lg border-copy-subtle border-1 ml-auto w-fit hidden"
          >
            <button
              type="button"
              className="p-space-3xs rounded-sm hover:bg-surface cursor-pointer"
              onMouseDown={handleSave}
              aria-label="Save"
              tabIndex={-1}
            >
              <Check className="h-5 w-5 text-copy" />
            </button>
            <button
              type="button"
              className="p-space-3xs rounded-sm hover:bg-surface cursor-pointer"
              onMouseDown={handleCancel}
              aria-label="Cancel"
              tabIndex={-1}
            >
              <X className="h-5 w-5 text-copy" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditable;
