import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  ShieldCheck,
  Bug,
  Sparkles,
  HelpCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { UserFeedbackTicket, UserAccount } from '../../types';
import { sound } from '../../utils/audio';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  tickets: UserFeedbackTicket[];
  onSubmitTicket: (newTicket: UserFeedbackTicket) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  tickets,
  onSubmitTicket
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [category, setCategory] = useState<'Bug Report' | 'Feature Request' | 'Content Improvement' | 'General Inquiry'>('Bug Report');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [notifyAdmins, setNotifyAdmins] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter tickets for this user (or if admin, show all)
  const myTickets = tickets.filter(
    (t) => t.userId === currentUser.id || currentUser.role === 'admin'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    sound.playSuccess();
    const newTicket: UserFeedbackTicket = {
      id: `fb_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      category,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Pending Review',
      emailNotificationSent: notifyAdmins,
      adminEmailRecipients: ['admin@edubridge.org', 'dev-lead@edubridge.org']
    };

    onSubmitTicket(newTicket);
    setSubject('');
    setDescription('');
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab('history');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">User Feedback &amp; Bug Center</h3>
              <p className="text-xs text-slate-500">Direct Channel Between Users and EduBridge Administrators</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => { sound.playClick(); setActiveTab('create'); }}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'create'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Submit Feedback or Report Bug
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('history'); }}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>My Tickets &amp; Admin Responses</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {myTickets.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Feedback Dispatched Successfully!</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Automated email sent to <strong>admin@edubridge.org</strong> and <strong>dev-lead@edubridge.org</strong>. Administrators will review and respond.
                  </p>
                </div>
              )}

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Bug Report">Bug Report (Application Issue)</option>
                    <option value="Feature Request">Feature Request (Enhancement)</option>
                    <option value="Content Improvement">Content Improvement (Questions/Curriculum)</option>
                    <option value="General Inquiry">General Inquiry / Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Urgency Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Low">Low (General suggestion)</option>
                    <option value="Medium">Medium (Affects workflow)</option>
                    <option value="High">High (Feature not working properly)</option>
                    <option value="Critical">Critical (Blocking learning/exam)</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject Summary</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. IELTS Writing Word Counter resets on section switch"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description &amp; Reproduction Steps</label>
                <textarea
                  rows={5}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what occurred, your browser or device, and what enhancement you would love to see..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email notification check */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold text-indigo-900 block text-xs">Simulate Email Notification to Admin List</span>
                    <span className="text-[11px] text-slate-500">Recipients: admin@edubridge.org, dev-lead@edubridge.org</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyAdmins}
                  onChange={(e) => setNotifyAdmins(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ticket to Admin Team</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {myTickets.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">No Feedback Tickets Raised Yet</p>
                  <p className="text-xs text-slate-400">Submit a ticket to report issues or suggest features.</p>
                </div>
              ) : (
                myTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                  >
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-bold text-indigo-700 uppercase">{ticket.category}</span>
                          <span>·</span>
                          <span className="font-mono">{ticket.createdAt}</span>
                          <span>·</span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                            ticket.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                            ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {ticket.priority} Priority
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">{ticket.subject}</h4>
                      </div>

                      <span className={`px-3 py-1 rounded-xl text-xs font-black self-start sm:self-auto ${
                        ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        ticket.status === 'Investigating' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {ticket.description}
                    </p>

                    {/* Email dispatched proof */}
                    {ticket.emailNotificationSent && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Email dispatched to admin notification list on creation</span>
                      </div>
                    )}

                    {/* Admin Response Box */}
                    {ticket.adminResponse ? (
                      <div className="p-4 bg-white rounded-xl border border-indigo-200 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            <span>Administrator Response from {ticket.adminResponse.respondedBy}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {ticket.adminResponse.respondedAt}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          "{ticket.adminResponse.message}"
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-white/50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Admin response pending. You will see replies here as soon as our team reviews this issue.</span>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
