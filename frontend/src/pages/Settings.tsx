import React, { useContext } from 'react';
import { Bell, Check, Monitor, Moon, Settings as SettingsIcon, ShieldCheck, Sun, User2 } from 'lucide-react';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';
import { ThemeContext } from '../ThemeContext';

const Settings: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <FeatureShell eyebrow="Workspace preferences" title="Settings" description="Manage the preferences currently available in this CareerFit workspace." icon={SettingsIcon}>
      <div className="cf-settings-layout">
        <nav className="cf-card cf-settings-nav" aria-label="Settings sections"><a className="active" href="#appearance"><Monitor size={15} /> Appearance</a><a href="#profile"><User2 size={15} /> Profile</a><a href="#privacy"><ShieldCheck size={15} /> Privacy</a><a href="#notifications"><Bell size={15} /> Notifications</a></nav>
        <div className="cf-settings-content">
          <section className="cf-card cf-card-pad" id="appearance"><SectionTitle icon={Monitor} title="Appearance" /><p className="cf-settings-description">Choose how CareerFit looks on this device. Your preference is saved in this browser.</p><div className="cf-settings-row"><div className="cf-settings-copy"><strong>Color theme</strong><p>Use a light or dark interface.</p></div><div className="cf-theme-choice"><button className={`cf-theme-option${!darkMode ? ' selected' : ''}`} onClick={() => darkMode && toggleTheme()} type="button" aria-pressed={!darkMode}><Sun size={16} /> Light</button><button className={`cf-theme-option${darkMode ? ' selected' : ''}`} onClick={() => !darkMode && toggleTheme()} type="button" aria-pressed={darkMode}><Moon size={16} /> Dark</button></div></div><div className="cf-settings-row"><div className="cf-settings-copy"><strong>Current appearance</strong><p>{darkMode ? 'Dark theme is enabled.' : 'Light theme is enabled.'}</p></div><span className="cf-settings-status"><Check size={14} /> Active</span></div></section>
          <section className="cf-card cf-card-pad" id="profile"><SectionTitle icon={User2} title="Profile" /><div className="cf-settings-not-configured"><User2 size={18} /><div><strong>Profile management isn’t configured</strong><p>This version doesn’t have account profiles or sign-in details to edit.</p></div></div></section>
          <section className="cf-card cf-card-pad" id="privacy"><SectionTitle icon={ShieldCheck} title="Privacy and data" /><div className="cf-settings-not-configured"><ShieldCheck size={18} /><div><strong>Resume files are temporary</strong><p>Uploaded resumes are parsed for analysis and the original file is removed. Saved history contains summaries, scores, and skill lists.</p></div></div></section>
          <section className="cf-card cf-card-pad" id="notifications"><SectionTitle icon={Bell} title="Notifications" /><div className="cf-settings-not-configured"><Bell size={18} /><div><strong>No notification preferences are available</strong><p>CareerFit does not currently send account or email notifications.</p></div></div></section>
        </div>
      </div>
    </FeatureShell>
  );
};

export default Settings;
