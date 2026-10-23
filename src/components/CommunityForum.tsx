import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle, 
  Plus, 
  Tag, 
  MapPin, 
  Search, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  WifiOff, 
  Wifi, 
  RefreshCw,
  Share2
} from 'lucide-react';
import { saveToOfflineOutbox, getOfflineOutbox } from '../utils/offlineStorage';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'Master Farmer' | 'Agritex Extension Officer' | 'Smallholder Farmer' | 'Vet Technician';
  location: string;
  province: string;
  cropTag: 'Maize' | 'Sorghum' | 'Groundnuts' | 'Tomatoes' | 'Cattle' | 'Goats' | 'Small Grains' | 'General Pfumvudza';
  regionTag: 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V';
  category: 'Technique & Success' | 'Pest & Disease Alert' | 'Question & Advice' | 'Market & Transport';
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isVerifiedExtensionAdvice: boolean;
  moderationStatus: 'Approved' | 'Pending Review';
  replies: Array<{
    id: string;
    author: string;
    authorRole: string;
    content: string;
    createdAt: string;
    isVerified?: boolean;
  }>;
}

const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'How we achieved 24 bags of maize per Pfumvudza plot in Domboshava',
    content: 'Fellow farmers, we strictly kept 75cm x 60cm basin spacing and applied 1 standard beer bottle cap of Compound D covered with 2cm soil. What changed the game during the January dry spell was 5cm of thatch grass mulch—the soil stayed damp for 18 days without rain!',
    author: 'Cde. Mavis Mutasa',
    authorRole: 'Master Farmer',
    location: 'Domboshava, Goromonzi',
    province: 'Mashonaland East',
    cropTag: 'Maize',
    regionTag: 'IIa',
    category: 'Technique & Success',
    createdAt: '2 hours ago',
    upvotes: 42,
    isVerifiedExtensionAdvice: true,
    moderationStatus: 'Approved',
    replies: [
      {
        id: 'rep-1',
        author: 'Mr. T. Chigumira (Agritex Extension)',
        authorRole: 'Agritex Extension Officer',
        content: 'Verified practice: That thickness of mulch reduces soil temperature by 4 to 6°C and suppresses 80% of broadleaf weeds.',
        createdAt: '1 hour ago',
        isVerified: true,
      },
      {
        id: 'rep-2',
        author: 'Baba Tendai',
        authorRole: 'Smallholder Farmer',
        content: 'Did you apply wood ash for Fall Armyworm too, Mai Mutasa?',
        createdAt: '45 mins ago',
      },
    ],
  },
  {
    id: 'post-2',
    title: 'URGENT PEST ALERT: Early Fall Armyworm larvae spotted in Mazowe Concession',
    content: 'Inspected 5 plots along the valley yesterday. Found pinhole damage and green frass in 3rd leaf whorls. Please scout early mornings. We sprayed Karate Zeon 5CS (18ml per knapsack) before the caterpillars could burrow deep into the stem.',
    author: 'Tafadzwa Nyoni',
    authorRole: 'Smallholder Farmer',
    location: 'Concession, Mazowe',
    province: 'Mashonaland Central',
    cropTag: 'Maize',
    regionTag: 'IIa',
    category: 'Pest & Disease Alert',
    createdAt: '4 hours ago',
    upvotes: 36,
    isVerifiedExtensionAdvice: true,
    moderationStatus: 'Approved',
    replies: [
      {
        id: 'rep-3',
        author: 'Agritex Plant Protection Tech',
        authorRole: 'Vet Technician',
        content: 'Correct action. Ensure application reaches down into the central funnel. If larvae exceed 15mm, rotate to Ampligo.',
        createdAt: '3 hours ago',
        isVerified: true,
      },
    ],
  },
  {
    id: 'post-3',
    title: 'Success with SV-2 White Sorghum in Gokwe South drought season',
    content: 'While hybrid maize failed during the February dry spell, our SV-2 sorghum yielded 14 bags. The local GMB depot bought at $335/tonne with zero deduction. Recommend every farmer in Region IV plant at least 2 plots of small grains as food insurance.',
    author: 'Sekuru Sibanda',
    authorRole: 'Master Farmer',
    location: 'Nembudziya, Gokwe South',
    province: 'Midlands',
    cropTag: 'Sorghum',
    regionTag: 'IV',
    category: 'Technique & Success',
    createdAt: '1 day ago',
    upvotes: 58,
    isVerifiedExtensionAdvice: true,
    moderationStatus: 'Approved',
    replies: [
      {
        id: 'rep-4',
        author: 'Farai Moyo',
        authorRole: 'Smallholder Farmer',
        content: 'Where did you buy certified SV-2 seed? Our local agro-dealer ran out in December.',
        createdAt: '18 hours ago',
      },
    ],
  },
  {
    id: 'post-4',
    title: 'Question: Best timing for dipping cattle against January Disease (Theileriosis)?',
    content: 'We noticed a heavy flush of bont ticks after last week rains. Our communal dip tank runs every Wednesday. Is weekly dipping sufficient or should we hand-dress ear bases with tick grease between visits?',
    author: 'Blessing Sithole',
    authorRole: 'Smallholder Farmer',
    location: 'Chipinge North',
    province: 'Manicaland',
    cropTag: 'Cattle',
    regionTag: 'I',
    category: 'Question & Advice',
    createdAt: '1 day ago',
    upvotes: 19,
    isVerifiedExtensionAdvice: false,
    moderationStatus: 'Approved',
    replies: [
      {
        id: 'rep-5',
        author: 'Dr. E. Matenga',
        authorRole: 'Agritex Extension Officer',
        content: 'Official Department of Veterinary Services directive: Hand-dressing ears, tail switches, and perianal folds with tick grease or Decatix pour-on every 3 days between communal dip days is strongly recommended during peak wet season.',
        createdAt: '14 hours ago',
        isVerified: true,
      },
    ],
  },
];

interface Props {
  currentLocationName: string;
  isOfflineMode: boolean;
}

export const CommunityForum: React.FC<Props> = ({ 
  currentLocationName,
  isOfflineMode 
}) => {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  // New Post Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('Murimi Farmer');
  const [newCropTag, setNewCropTag] = useState<ForumPost['cropTag']>('Maize');
  const [newRegionTag, setNewRegionTag] = useState<ForumPost['regionTag']>('IIa');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('Technique & Success');

  // Handle Post Creation
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    // Simple Automated Content Moderation Check
    const inappropriateKeywords = ['scam', 'crypto', 'fake', 'casino', 'betting'];
    const hasSpam = inappropriateKeywords.some(kw => 
      newTitle.toLowerCase().includes(kw) || newContent.toLowerCase().includes(kw)
    );

    if (hasSpam) {
      alert('Community Guidelines: Post contains irrelevant or unverified non-agricultural content.');
      return;
    }

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: newAuthor.trim() || 'Smallholder Farmer',
      authorRole: 'Smallholder Farmer',
      location: currentLocationName,
      province: 'Zimbabwe District',
      cropTag: newCropTag,
      regionTag: newRegionTag,
      category: newCategory,
      createdAt: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      isVerifiedExtensionAdvice: false,
      moderationStatus: 'Approved',
      replies: [],
    };

    if (isOfflineMode) {
      // Save to Offline Outbox
      saveToOfflineOutbox({
        type: 'community_post',
        payload: newPost,
      });
      setFeedbackBanner('Offline Outbox: Your post has been saved locally and will broadcast to the community once cellular connectivity is restored.');
    } else {
      setFeedbackBanner('Post shared successfully with the Farmers Dictionary Zw community!');
    }

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');

    setTimeout(() => setFeedbackBanner(null), 6000);
  };

  const handleUpvote = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const delta = p.hasUpvoted ? -1 : 1;
          return {
            ...p,
            upvotes: p.upvotes + delta,
            hasUpvoted: !p.hasUpvoted,
          };
        }
        return p;
      })
    );
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      author: 'Farmer ' + (currentLocationName.split(',')[0] || 'Member'),
      authorRole: 'Smallholder Farmer',
      content: replyText.trim(),
      createdAt: 'Just now',
    };

    if (isOfflineMode) {
      saveToOfflineOutbox({
        type: 'comment',
        payload: { postId, ...newReply },
      });
      setFeedbackBanner('Reply stored in offline queue. Will sync on reconnection.');
    }

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [...p.replies, newReply],
          };
        }
        return p;
      })
    );

    setReplyText('');
    setActiveReplyPostId(null);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchCrop = selectedCropFilter === 'All' || post.cropTag === selectedCropFilter;
    const matchRegion = selectedRegionFilter === 'All' || post.regionTag === selectedRegionFilter;
    const matchSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCrop && matchRegion && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Forum Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                👥
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Farmers Dictionary Zw Community Forum (Dare reVarimi / Inkundla Yabalimi)
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">
              Connect with fellow smallholder farmers and verified Agritex extension officers across Zimbabwe. Share Pfumvudza techniques, alert neighbors to pest outbreaks, and discuss market opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Post Question / Tip
            </button>
          </div>
        </div>

        {feedbackBanner && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{feedbackBanner}</span>
            </div>
            <button onClick={() => setFeedbackBanner(null)} className="text-slate-400 hover:text-slate-600 text-[10px]">
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search discussions (e.g. Pfumvudza mulch, Fall Armyworm, SV-2 Sorghum)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Crop Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold shrink-0">Crop:</span>
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Crops</option>
            <option value="Maize">Maize (Chibage)</option>
            <option value="Sorghum">Sorghum (Mhunga)</option>
            <option value="Groundnuts">Groundnuts (Nzungu)</option>
            <option value="Small Grains">Small Grains</option>
            <option value="Cattle">Cattle (Mombe)</option>
            <option value="Goats">Goats (Mbudzi)</option>
          </select>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold shrink-0">Region:</span>
          <select
            value={selectedRegionFilter}
            onChange={(e) => setSelectedRegionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Regions</option>
            <option value="I">Region I (Highlands)</option>
            <option value="IIa">Region IIa (Mazowe/Goromonzi)</option>
            <option value="IIb">Region IIb (Chinhoyi)</option>
            <option value="III">Region III (Midlands)</option>
            <option value="IV">Region IV (Gokwe/Lupane)</option>
            <option value="V">Region V (Chiredzi/Gwanda)</option>
          </select>
        </div>
      </div>

      {/* Discussion Threads List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div 
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition"
          >
            {/* Post Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  post.category === 'Pest & Disease Alert'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : post.category === 'Technique & Success'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {post.category}
                </span>

                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                  Crop: {post.cropTag}
                </span>

                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                  Region {post.regionTag}
                </span>

                {post.isVerifiedExtensionAdvice && (
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                    <ShieldCheck className="w-3 h-3 text-amber-700" />
                    Agritex Moderated
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                {post.createdAt}
              </span>
            </div>

            {/* Post Title */}
            <h4 className="font-extrabold text-base text-slate-900 mb-2">
              {post.title}
            </h4>

            {/* Content */}
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              {post.content}
            </p>

            {/* Author Footer & Interactivity */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">
                  {post.author[0]}
                </div>
                <div>
                  <span className="font-bold text-slate-800">{post.author}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">• {post.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    post.hasUpvoted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes} Helpful</span>
                </button>

                <button
                  onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.replies.length} Replies</span>
                </button>
              </div>
            </div>

            {/* Expanded Replies Thread */}
            {post.replies.length > 0 && (
              <div className="mt-3 pt-3 pl-4 border-l-2 border-emerald-200 space-y-2 bg-slate-50/50 p-3 rounded-r-xl">
                {post.replies.map((rep) => (
                  <div key={rep.id} className="text-xs">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-slate-800">{rep.author}</span>
                      {rep.isVerified && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" /> Verified Agritex
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 ml-auto">{rep.createdAt}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            {activeReplyPostId === post.id && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a helpful agronomic reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleAddReply(post.id)}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Reply
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
            No discussions found matching the current filters. Try selecting "All Crops" or post your question!
          </div>
        )}
      </div>

      {/* Create New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h4 className="font-bold text-base text-slate-900">
                Share Agricultural Question or Experience
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best seed variety for drought resistance in Gokwe..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Your Name / Homestead
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                  >
                    <option value="Technique & Success">Technique & Success</option>
                    <option value="Pest & Disease Alert">Pest & Disease Alert</option>
                    <option value="Question & Advice">Question & Advice</option>
                    <option value="Market & Transport">Market & Transport</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Crop / Enterprise Tag
                  </label>
                  <select
                    value={newCropTag}
                    onChange={(e) => setNewCropTag(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                  >
                    <option value="Maize">Maize (Chibage)</option>
                    <option value="Sorghum">Sorghum (Mhunga)</option>
                    <option value="Groundnuts">Groundnuts (Nzungu)</option>
                    <option value="Small Grains">Small Grains</option>
                    <option value="Tomatoes">Tomatoes</option>
                    <option value="Cattle">Cattle (Mombe)</option>
                    <option value="Goats">Goats (Mbudzi)</option>
                    <option value="General Pfumvudza">General Pfumvudza</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Natural Farming Region
                  </label>
                  <select
                    value={newRegionTag}
                    onChange={(e) => setNewRegionTag(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                  >
                    <option value="I">Region I (Highlands)</option>
                    <option value="IIa">Region IIa</option>
                    <option value="IIb">Region IIb</option>
                    <option value="III">Region III</option>
                    <option value="IV">Region IV</option>
                    <option value="V">Region V</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Discussion Details / Observation
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details on application rates, results, or questions for fellow farmers..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Posts are moderated to maintain verified agricultural advice and protect community trust.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
