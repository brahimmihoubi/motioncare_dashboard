/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, Send, MessageSquare, Phone, Mail, ThumbsUp, Sparkles } from 'lucide-react';

export default function SupportCenterView() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'system'; text: string; time: string }[]>([
    { sender: 'system', text: 'Hello, welcome to MotionCare Support. How can we help you today?', time: '09:00 AM' }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = { sender: 'user' as const, text: inputVal, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Simulated reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          text: `Thanks for reaching out! We received your message about "${userMsg.text}". A technical advisor will update you shortly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  const FAQs = [
    { q: 'How do I change patient status from Inactive?', a: 'Go to the Patients page, click Edit on the patient card or row, change the Status dropdown value to Active, and save.' },
    { q: 'Can I prescribe custom exercises?', a: 'Yes! Navigate to the Programs tab and select Create Program, or use the Exercise Library simulator to customize specific reps.' },
    { q: 'Are joint motion angles measured automatically?', a: 'Yes, if Tele-Rehab with video camera tracking is toggled in the clinical session.' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Clinical Support Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Read system guides or chat directly with our technical support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Contact Cards & FAQs */}
        <div className="lg:col-span-2 space-y-6">
          {/* FAQs */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <HelpCircle className="w-4.5 h-4.5 text-cyan-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQs.map((faq, i) => (
                <details key={i} className="group border-b border-slate-50 pb-3 last:border-0 last:pb-0 select-none cursor-pointer">
                  <summary className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-sm hover:text-cyan-600 transition-colors list-none flex items-center justify-between">
                    <span>{faq.q}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform font-bold text-xs">▼</span>
                  </summary>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 pl-2 border-l border-cyan-100 font-medium">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Quick Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4.5 flex items-center gap-4.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Phone Support</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">+1 (800) 555-MCARE</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4.5 flex items-center gap-4.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Email Support</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">support@motioncare.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Simulator */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[400px]">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Direct Support Line</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Response Time: &lt; 2m</p>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m, idx) => {
              const isSystem = m.sender === 'system';
              return (
                <div key={idx} className={`flex ${isSystem ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 shadow-xs ${
                    isSystem
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                      : 'bg-cyan-600 text-white rounded-tr-none'
                  }`}>
                    <p className="leading-relaxed font-medium">{m.text}</p>
                    <span className={`block text-[8px] mt-1.5 text-right ${isSystem ? 'text-slate-400' : 'text-cyan-200'} font-semibold uppercase`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <input
              type="text"
              placeholder="Describe your issue or question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
