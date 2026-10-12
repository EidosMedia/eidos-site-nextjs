'use client';

import { useEffect } from 'react';
import { X, MailOpen, ChevronDown, CircleHelp } from 'lucide-react';
import { Button } from './baseComponents/button';

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-overlay overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-space-sm">
        <div className="relative w-full max-w-2xl bg-canvas rounded-xl shadow-2xl p-space-md sm:p-space-lg">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-space-sm right-space-sm text-copy-subtle hover:text-heading transition cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-space-lg flex flex-col items-center">
            <div className="bg-surface p-space-sm rounded-full mb-space-sm relative">
              <MailOpen className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-h3 text-heading mb-space-2xs mt-space-sm">Thanks for your interest in Eidosmedia.</h2>
            <p className="text-body-sm text-copy-muted max-w-lg mx-auto">
              If you have questions about how our solutions can benefit your organization, please complete the form
              below and we'll get back to you.
            </p>
          </div>

          <form
            className="space-y-space-md"
            onSubmit={e => {
              e.preventDefault();
              onClose();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div>
                <label className="block text-label text-copy mb-space-3xs">First Name</label>
                <input
                  required
                  type="text"
                  placeholder="First Name"
                  className="w-full border border-line rounded-sm text-body-sm px-space-sm h-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-label text-copy mb-space-3xs">Second Name</label>
                <input
                  required
                  type="text"
                  placeholder="Last Name"
                  className="w-full border border-line rounded-sm text-body-sm px-space-sm h-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-label text-copy mb-space-3xs">Company</label>
                <input
                  required
                  type="text"
                  className="w-full border border-line rounded-sm text-body-sm px-space-sm h-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-label text-copy mb-space-3xs">Email</label>
                <input
                  required
                  type="email"
                  placeholder="you@email.com"
                  className="w-full border border-line rounded-sm text-body-sm px-space-sm h-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-label text-copy mb-space-3xs">Phone</label>
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-line rounded-sm text-body-sm px-space-sm h-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-label text-copy mb-space-3xs">Country</label>
                <div className="relative">
                  <select
                    required
                    defaultValue=""
                    className="w-full border border-line rounded-sm text-body-sm px-space-sm h-10 bg-canvas focus:outline-none focus:ring-2 focus:ring-primary text-copy appearance-none pr-space-xl"
                  >
                    <option value="" disabled hidden>
                      Select a country...
                    </option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-space-sm top-1/2 -translate-y-1/2 w-4 h-4 text-copy-subtle pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-label text-copy mb-space-3xs">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Leave us a message"
                className="w-full border border-line rounded-sm text-body-sm px-space-sm py-space-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-label text-copy mb-space-2xs">How did you find us?</label>
              <div className="space-y-space-3xs">
                {['Google', 'Linkedin', 'YouTube', 'Event', 'Ads'].map(source => (
                  <div key={source} className="flex items-center">
                    <input
                      type="radio"
                      name="source"
                      value={source}
                      required
                      className="w-3 h-3 text-primary-dark border-line focus:ring-primary cursor-pointer"
                    />
                    <label className="ml-space-2xs text-caption text-heading">{source}</label>
                  </div>
                ))}
                <div className="flex items-center flex-wrap sm:flex-nowrap gap-space-2xs sm:gap-0 mt-space-3xs">
                  <input
                    type="radio"
                    name="source"
                    value="Other"
                    required
                    className="w-3 h-3 text-primary-dark border-line focus:ring-primary cursor-pointer"
                  />
                  <label className="ml-space-2xs text-caption text-heading w-12 shrink-0">Other</label>
                  <input
                    type="text"
                    className="flex-1 ml-0 sm:ml-space-2xs min-w-30 bg-surface border border-line rounded-sm h-7 px-space-2xs text-caption focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <div className="relative group ml-space-2xs flex items-center">
                    <button type="button" className="flex items-center justify-center cursor-pointer">
                      <CircleHelp className="w-4 h-4 text-inverse" fill="var(--color-ink-deep)" />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-space-2xs hidden group-hover:block bg-ink-deep text-inverse text-caption px-space-xs py-space-2xs rounded-sm whitespace-nowrap shadow-lg z-10">
                      Choose your souce
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-ink-deep"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start mt-space-md">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <input
                    required
                    id="updates"
                    type="checkbox"
                    className="w-4 h-4 text-primary-dark border-line rounded-sm bg-canvas focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="updates" className="ml-space-2xs text-caption text-heading font-medium">
                    I would like to receive occasional updates on this topic.{' '}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-space-2xs flex justify-center">
              <Button
                type="submit"
                variant="default"
                className="rounded-full px-space-5xl py-space-xs bg-primary hover:bg-primary-dark text-inverse font-bold w-full md:w-auto cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
