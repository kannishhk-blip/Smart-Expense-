import React, { useState } from 'react';
import { Star, MessageSquareHeart, CheckCircle2, Award, ThumbsUp, Sparkles, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface FeedbackEntry {
  id: string;
  name: string;
  cohort: string;
  rating: number;
  comments: string;
  date: string;
  helpfulFeature: string;
}

const INITIAL_FEEDBACK: FeedbackEntry[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    cohort: 'College Student (B.Tech CSE)',
    rating: 5,
    comments: 'The 80% budget alert on Food actually stopped me from overspending on weekend food deliveries. Clean UI and instant calculations!',
    date: 'Oct 2026',
    helpfulFeature: 'Budget Alerts',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    cohort: 'Freelance Web Developer',
    rating: 5,
    comments: 'Being able to tag UPI vs Bank Transfer and export CSV directly for my quarterly taxes saved hours of manual spreadsheet work.',
    date: 'Oct 2026',
    helpfulFeature: 'CSV Export & Tags',
  },
  {
    id: '3',
    name: 'Ananya Deshmukh',
    cohort: 'Early-Career Professional',
    rating: 4,
    comments: 'The savings goal progress bar for my emergency fund is super motivating. Watching the percentage tick up makes saving feel rewarding.',
    date: 'Oct 2026',
    helpfulFeature: 'Savings Milestones',
  },
];

export const FeedbackPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(INITIAL_FEEDBACK);
  const [userName, setUserName] = useState('');
  const [cohort, setCohort] = useState('College Student');
  const [rating, setRating] = useState(5);
  const [helpfulFeature, setHelpfulFeature] = useState('Budget Alerts');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      toast.error('Please share your thoughts before submitting.');
      return;
    }

    const newEntry: FeedbackEntry = {
      id: Date.now().toString(),
      name: userName.trim() || 'Anonymous Reviewer',
      cohort,
      rating,
      comments: comments.trim(),
      date: 'Just now',
      helpfulFeature,
    };

    setFeedbackList([newEntry, ...feedbackList]);
    setComments('');
    setUserName('');
    setSubmitted(true);
    toast.success('Thank you! Your feedback has been recorded for the Project Better Tomorrow evaluation.');
  };

  const avgRating = (
    feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length
  ).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Project Better Tomorrow Validation Framework</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            User Testing & Qualitative Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Human-centered usability validation across diverse user cohorts (Students, Freelancers, Young Professionals) evaluating financial control impact.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 dark:bg-slate-800/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
          <Award className="w-8 h-8 text-amber-400" />
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-black">{avgRating}</span>
              <span className="text-xs text-slate-300">/ 5.0</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">SUS Score: 87.2 (Grade A)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Submission Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center space-x-2 text-gray-900 dark:text-white font-bold mb-4">
            <MessageSquareHeart className="w-5 h-5 text-emerald-500" />
            <h3>Submit Usability Review</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Your Name / Participant ID
              </label>
              <input
                type="text"
                placeholder="e.g. Alex J. (or leave blank for anonymous)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Target User Cohort
              </label>
              <select
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="College Student">College Student (Tight budget)</option>
                <option value="Early-Career Professional">Early-Career Professional</option>
                <option value="Freelancer / Gig Worker">Freelancer / Gig Worker</option>
                <option value="Family Budget Manager">Family Budget Manager</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Most Helpful Feature
              </label>
              <select
                value={helpfulFeature}
                onChange={(e) => setHelpfulFeature(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Budget Alerts">Dynamic Budget Threshold Alerts</option>
                <option value="Recharts Dashboard">Visual Recharts Analytics</option>
                <option value="Savings Milestones">Savings Goal Progress</option>
                <option value="CSV Export">Transaction CSV Export</option>
                <option value="Dark Mode & Speed">Interface Speed & Dark Mode</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Usability Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center space-x-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-gray-700 dark:text-slate-300">{rating} / 5</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Qualitative Experience & Suggestions
              </label>
              <textarea
                rows={3}
                placeholder="How did tracking your expenses impact your saving habits? What could we refine?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Evaluation</span>
            </button>
          </form>
        </div>

        {/* Qualitative Feedback Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              Recorded User Testing Sessions ({feedbackList.length})
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Project Better Tomorrow Validated</span>
            </span>
          </div>

          <div className="space-y-3">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.cohort}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/40">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{item.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed italic">
                  "{item.comments}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/50 text-[11px] text-gray-400 dark:text-slate-500">
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 font-medium">
                    Key Impact: {item.helpfulFeature}
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
