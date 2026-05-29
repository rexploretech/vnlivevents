'use client';

import { Video, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const templates = [
  {
    id: 'template1',
    href: '/admin/events/new/template1',
    icon: Video,
    title: 'Template 1',
    subtitle: 'Cinematic Live-Stream Invitation',
    description:
      'A full-screen immersive invitation with countdown timer, YouTube live-stream player, falling petal particles, and occasion presets (Wedding, Birthday, Half Saree, and more).',
    tags: ['Countdown', 'Video Player', 'Particles', 'All Occasions'],
    accent: '#C9A84C',
  },
  {
    id: 'template2',
    href: '/admin/events/new/template2',
    icon: Globe,
    title: 'Template 2',
    subtitle: 'Telugu Multi-Section Wedding Website',
    description:
      'A multi-page Telugu wedding website with Home, Our Story (మన కథ), Program (కార్యక్రమం), Gallery (గ్యాలరీ), and Contact (సంప్రదించండి) sections.',
    tags: ['Our Story', 'Program', 'Gallery', 'Telugu'],
    accent: '#C2637A',
  },
];

export default function ChooseTemplatePage() {
  return (
    <>
      <div className="mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-gold-light mb-1">Create New Event</h2>
        <p className="font-sans text-sm text-cream/60">Choose an invitation template to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(({ id, href, icon: Icon, title, subtitle, description, tags, accent }) => (
          <Link
            key={id}
            href={href}
            className="group flex flex-col bg-[#1a0a14] border border-gold/10 rounded-lg overflow-hidden hover:border-gold/40 hover:shadow-[0_0_30px_rgba(201,168,76,0.12)] transition-all duration-300"
          >
            {/* Color strip */}
            <div
              className="h-1.5 w-full"
              style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            />

            <div className="p-6 flex flex-col flex-1">
              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${accent}20`, border: `1px solid ${accent}30` }}
                >
                  <Icon size={22} style={{ color: accent }} />
                </div>
                <div>
                  <p className="font-cinzel text-base text-gold uppercase tracking-wider leading-tight">{title}</p>
                  <p className="font-sans text-xs text-cream/50 mt-0.5">{subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-sm text-cream/60 leading-relaxed mb-5 flex-1">{description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border font-medium"
                    style={{ color: accent, borderColor: `${accent}30`, backgroundColor: `${accent}10` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
                style={{ color: accent }}
              >
                <span>Use {title}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
