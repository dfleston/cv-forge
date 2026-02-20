import React from 'react';
import { CVData, ThemeDefinition } from '../types';
import { Mail, MapPin, Globe, Github, Linkedin, Twitter, ExternalLink, Calendar, Briefcase, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

interface StructuredCVProps {
    data: CVData;
    theme: ThemeDefinition;
}

export const StructuredCV: React.FC<StructuredCVProps> = ({ data, theme }) => {
    const { personal, narrative, experience, education, skills, projects, accomplishments, certifications, languages } = data;

    return (
        <div className={`space-y-8 ${theme.container}`}>
            {/* Header */}
            <header className={`${theme.header} space-y-4`}>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">{personal.name}</h1>
                        <p className={`text-xl font-medium ${theme.accent}`}>{personal.title}</p>
                        <p className={`text-sm italic ${theme.text}`}>{personal.tagline}</p>
                    </div>
                    <div className="text-right space-y-1 text-sm text-slate-500">
                        <div className="flex items-center justify-end gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {personal.location}
                        </div>
                        <div className="flex items-center justify-end gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {personal.contact.email}
                        </div>
                        {personal.contact.website && (
                            <div className="flex items-center justify-end gap-1.5">
                                <Globe className="w-3.5 h-3.5" />
                                {personal.contact.website}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs">
                    {personal.social.github && (
                        <a href={`https://github.com/${personal.social.github}`} className={`flex items-center gap-1 ${theme.link}`}>
                            <Github className="w-3.5 h-3.5" />
                            github.com/{personal.social.github}
                        </a>
                    )}
                    {personal.social.linkedin && (
                        <a href={`https://linkedin.com/in/${personal.social.linkedin}`} className={`flex items-center gap-1 ${theme.link}`}>
                            <Linkedin className="w-3.5 h-3.5" />
                            linkedin.com/in/{personal.social.linkedin}
                        </a>
                    )}
                    {personal.social.twitter && (
                        <a href={`https://twitter.com/${personal.social.twitter}`} className={`flex items-center gap-1 ${theme.link}`}>
                            <Twitter className="w-3.5 h-3.5" />
                            @{personal.social.twitter}
                        </a>
                    )}
                </div>
            </header>

            {/* Narrative Section */}
            <section className="space-y-3">
                <h2 className={theme.sectionTitle}>Professional Narrative</h2>
                <div className={`space-y-3 ${theme.text}`}>
                    <p className="font-medium italic border-l-2 border-slate-200 pl-4">{narrative.short}</p>
                    <div className="whitespace-pre-wrap">{narrative.long}</div>
                </div>
            </section>

            <hr className={theme.hr} />

            <div className="grid grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="col-span-2 space-y-8">
                    {/* Experience */}
                    <section className="space-y-6">
                        <h2 className={theme.sectionTitle}>Experience</h2>
                        <div className="space-y-8">
                            {experience.map((exp, idx) => (
                                <div key={idx} className={`${theme.timeline} relative`}>
                                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{exp.title}</h3>
                                                <p className={`font-medium ${theme.accent}`}>{exp.company}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={theme.badge}>{exp.start_date} – {exp.end_date}</span>
                                                <p className="text-xs text-slate-400 mt-1">{exp.location}</p>
                                            </div>
                                        </div>
                                        {exp.impact && (
                                            <p className={`text-sm border-l-2 border-blue-100 pl-3 py-1 italic bg-blue-50/30 font-medium ${theme.text}`}>
                                                {exp.impact}
                                            </p>
                                        )}
                                        <ul className="list-disc list-outside ml-4 space-y-1">
                                            {exp.highlights.map((h, i) => (
                                                <li key={i} className={`text-sm ${theme.text}`}>{h}</li>
                                            ))}
                                        </ul>
                                        {exp.skills_used && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {exp.skills_used.map((s, i) => (
                                                    <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-mono rounded text-slate-500">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section className="space-y-4">
                            <h2 className={theme.sectionTitle}>Featured Projects</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map((proj, idx) => (
                                    <div key={idx} className={`${theme.card}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-900">{proj.name}</h3>
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400">{proj.status}</span>
                                        </div>
                                        <p className="text-xs italic text-slate-500 mb-2">{proj.tagline}</p>
                                        {proj.impact && <p className="text-sm font-medium mb-2">{proj.impact}</p>}
                                        <div className="flex flex-wrap gap-1">
                                            {proj.stack.map((s, i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] rounded">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Skills */}
                    <section className="space-y-4">
                        <h2 className={theme.sectionTitle}>Skills</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Technical</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.technical.map((s, i) => (
                                        <div key={i} className="group relative">
                                            <span className={theme.badge}>{s.name}</span>
                                            {s.level > 0 && (
                                                <div className="absolute top-full left-0 mt-1 w-24 bg-white shadow-lg rounded border border-slate-100 p-1 hidden group-hover:block z-10">
                                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${s.level}%` }} />
                                                    </div>
                                                    <span className="text-[8px] text-slate-400 mt-1 block">{s.years}y experience</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {skills.soft.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Power Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.soft.map((s, i) => (
                                            <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs border border-slate-100 rounded">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Education */}
                    <section className="space-y-4">
                        <h2 className={theme.sectionTitle}>Education</h2>
                        <div className="space-y-4">
                            {education.map((edu, idx) => (
                                <div key={idx} className="space-y-1">
                                    <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                                    <p className="text-xs font-medium text-slate-500">{edu.field}</p>
                                    <p className="text-xs text-slate-400 italic">{edu.institution}</p>
                                    <p className="text-[10px] text-slate-400">{edu.graduation_date}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <section className="space-y-3">
                            <h2 className={theme.sectionTitle}>Certifications</h2>
                            <div className="space-y-2">
                                {certifications.map((cert, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{cert.name}</p>
                                            <p className="text-[10px] text-slate-500">{cert.issuer} • {cert.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <section className="space-y-3">
                            <h2 className={theme.sectionTitle}>Languages</h2>
                            <div className="space-y-2">
                                {languages.map((lang, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <span className="font-medium text-slate-700">{lang.language}</span>
                                        <span className="text-slate-400">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
