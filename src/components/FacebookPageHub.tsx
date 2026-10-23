import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Share2,
  Video,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  Download,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ThumbsUp,
  MessageCircle,
  Repeat,
  Radio,
  Send,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  Settings,
  Layers,
  BarChart3,
  Flame,
  Globe,
  Film,
  Smartphone,
  Eye,
  ShieldCheck,
  TrendingUp,
  Tag,
  Zap,
  Rss,
  CheckCircle2,
  X,
  ArrowRight,
  Lock,
  Unlock,
  Key,
  LogOut,
  UserCheck,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import {
  FacebookPageConfig,
  FacebookPublishedPost,
  InteractivePostTemplate,
  FacebookReelTemplate,
  INTERACTIVE_POST_TEMPLATES,
  FACEBOOK_REELS_TEMPLATES,
  INITIAL_PUBLISHED_FEED,
  ReelScene
} from '../data/facebookPageData';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { useLanguage } from '../context/LanguageContext';
import { ContentGenerator } from './ContentGenerator';

interface FacebookPageHubProps {
  currentLocation: ZimbabweLocation;
  onOpenWhatsAppModal?: (topic?: string, query?: string) => void;
}

export const FacebookPageHub: React.FC<FacebookPageHubProps> = ({
  currentLocation,
  onOpenWhatsAppModal
}) => {
  const { language } = useLanguage();

  // Active sub-navigation
  const [activeTab, setActiveTab] = useState<'posts' | 'generator' | 'reels' | 'feed' | 'settings'>('posts');

  // Page Configuration State (Connected to user's Facebook Page)
  const [pageConfig, setPageConfig] = useState<FacebookPageConfig & { pageUrl: string; publishMode: 'direct' | 'webhook' | 'graph_api'; webhookUrl?: string }>({
    pageId: '1312589948614022',
    pageName: 'Farmers Dictionary Zimbabwe',
    pageUrl: 'https://www.facebook.com/1312589948614022',
    category: 'Agricultural Community & Agritex Advisory Service',
    fanCount: 14850,
    pictureUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=200&q=80',
    isConnected: true,
    hasPublishPermissions: true,
    connectedAt: new Date().toISOString(),
    publishMode: 'direct',
    webhookUrl: ''
  });

  const [oauthCallbackUrl, setOauthCallbackUrl] = useState<string>(
    'https://ais-dev-iirwvujxhjhismccovw3wo-535649001550.europe-west2.run.app/auth/facebook/callback'
  );

  const [rssFeedUrl, setRssFeedUrl] = useState<string>(
    'https://ais-dev-iirwvujxhjhismccovw3wo-535649001550.europe-west2.run.app/api/facebook/feed.xml'
  );

  // Settings Form State
  const [inputPageName, setInputPageName] = useState<string>(pageConfig.pageName);
  const [inputPageUrl, setInputPageUrl] = useState<string>(pageConfig.pageUrl);
  const [inputWebhookUrl, setInputWebhookUrl] = useState<string>(pageConfig.webhookUrl || '');
  const [inputPageId, setInputPageId] = useState<string>(pageConfig.pageId);
  const [inputPageToken, setInputPageToken] = useState<string>('');
  const [settingsMethod, setSettingsMethod] = useState<'simple' | 'rss' | 'webhook' | 'meta_api'>('simple');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionMessage, setConnectionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Developer Authentication Gate State
  const [developerToken, setDeveloperToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('agri_dev_token') : null;
  });
  const [isDeveloperLoggedIn, setIsDeveloperLoggedIn] = useState<boolean>(false);
  const [developerEmail, setDeveloperEmail] = useState<string>('thulanitanaka144@gmail.com');
  const [devLoginPassword, setDevLoginPassword] = useState<string>('');
  const [devLoginEmail, setDevLoginEmail] = useState<string>('thulanitanaka144@gmail.com');
  const [devAuthError, setDevAuthError] = useState<string | null>(null);
  const [devAuthSuccess, setDevAuthSuccess] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);
  const [authViewMode, setAuthViewMode] = useState<'login' | 'register'>('login');
  const [newPasskey, setNewPasskey] = useState<string>('');
  const [confirmPasskey, setConfirmPasskey] = useState<string>('');
  const [currentPasskey, setCurrentPasskey] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [tokenVerifyState, setTokenVerifyState] = useState<{
    loading: boolean;
    result: any | null;
    error: string | null;
  }>({ loading: false, result: null, error: null });

  // Published feed
  const [feed, setFeed] = useState<FacebookPublishedPost[]>(INITIAL_PUBLISHED_FEED);

  // Post Studio State
  const [selectedTemplate, setSelectedTemplate] = useState<InteractivePostTemplate>(INTERACTIVE_POST_TEMPLATES[0]);
  const [postCaption, setPostCaption] = useState<string>(INTERACTIVE_POST_TEMPLATES[0].defaultMessage);
  const [postLanguage, setPostLanguage] = useState<'en' | 'sn' | 'nd'>('en');
  const [isPublishingPost, setIsPublishingPost] = useState<boolean>(false);
  const [isCopiedPost, setIsCopiedPost] = useState<boolean>(false);
  const [isGeneratingAiPost, setIsGeneratingAiPost] = useState<boolean>(false);

  // Quick 1-Click Publishing Modal / Feedback
  const [quickPostModal, setQuickPostModal] = useState<{
    isOpen: boolean;
    title: string;
    targetUrl: string;
  } | null>(null);

  // Reels Studio State
  const [selectedReel, setSelectedReel] = useState<FacebookReelTemplate>(FACEBOOK_REELS_TEMPLATES[0]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlayingReel, setIsPlayingReel] = useState<boolean>(false);
  const [reelVoiceLanguage, setReelVoiceLanguage] = useState<'en' | 'sn' | 'nd'>('en');
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [isCopiedReelText, setIsCopiedReelText] = useState<boolean>(false);
  const [quickReelModal, setQuickReelModal] = useState<{
    isOpen: boolean;
    title: string;
  } | null>(null);

  // Canvas Refs
  const postCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const reelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const reelTimerRef = useRef<any>(null);

  // Load server config on mount
  useEffect(() => {
    fetch('/api/facebook/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setPageConfig((prev) => ({
            ...prev,
            pageId: data.config.pageId || prev.pageId,
            pageName: data.config.pageName || prev.pageName,
            pageUrl: data.config.pageUrl || prev.pageUrl,
            category: data.config.category || prev.category,
            fanCount: data.config.fanCount || prev.fanCount,
            pictureUrl: data.config.pictureUrl || prev.pictureUrl,
            isConnected: data.config.isConnected,
            connectedAt: data.config.connectedAt,
            publishMode: data.config.publishMode || 'direct',
            webhookUrl: data.config.webhookUrl || ''
          }));
          if (data.config.pageUrl) setInputPageUrl(data.config.pageUrl);
          if (data.config.pageName) setInputPageName(data.config.pageName);
          if (data.config.webhookUrl) setInputWebhookUrl(data.config.webhookUrl);
          if (data.config.oauthCallbackUrl) setOauthCallbackUrl(data.config.oauthCallbackUrl);
          if (data.config.rssFeedUrl) setRssFeedUrl(data.config.rssFeedUrl);
        }
      })
      .catch((err) => console.warn('Could not load Facebook server config:', err));

    fetch('/api/facebook/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.posts) {
          setFeed(data.posts);
        }
      })
      .catch((err) => console.warn('Could not load published feed:', err));

    // Verify stored developer session
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('agri_dev_token') : null;
    if (storedToken) {
      fetch('/api/developer/session', {
        headers: { 'x-developer-token': storedToken }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.isAuthenticated) {
            setIsDeveloperLoggedIn(true);
            setDeveloperToken(storedToken);
            if (data.developerEmail) setDeveloperEmail(data.developerEmail);
          } else {
            localStorage.removeItem('agri_dev_token');
            setIsDeveloperLoggedIn(false);
            setDeveloperToken(null);
          }
        })
        .catch(() => {
          setIsDeveloperLoggedIn(false);
        });
    }
  }, []);

  // Developer Authentication Handlers
  const handleDeveloperLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setDevAuthError(null);
    setDevAuthSuccess(null);

    try {
      const res = await fetch('/api/developer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: devLoginEmail,
          password: devLoginPassword
        })
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('agri_dev_token', data.token);
        setDeveloperToken(data.token);
        setIsDeveloperLoggedIn(true);
        if (data.email) setDeveloperEmail(data.email);
        setDevAuthSuccess('Developer Access Granted! You now have full control.');
        setShowAuthModal(false);
        setDevLoginPassword('');
      } else {
        setDevAuthError(data.error || 'Incorrect developer passkey. (Default passkey: agritex2026)');
      }
    } catch (err: any) {
      setDevAuthError(err.message || 'Login connection failed');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleDeveloperRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasskey !== confirmPasskey) {
      setDevAuthError('New passkey and confirmation do not match');
      return;
    }
    if (newPasskey.length < 6) {
      setDevAuthError('Passkey must be at least 6 characters');
      return;
    }

    setIsSubmittingAuth(true);
    setDevAuthError(null);
    setDevAuthSuccess(null);

    try {
      const res = await fetch('/api/developer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: devLoginEmail,
          newPassword: newPasskey,
          currentPassword: currentPasskey
        })
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('agri_dev_token', data.token);
        setDeveloperToken(data.token);
        setIsDeveloperLoggedIn(true);
        setDevAuthSuccess('Developer passkey updated! Controls unlocked.');
        setShowAuthModal(false);
        setNewPasskey('');
        setConfirmPasskey('');
        setCurrentPasskey('');
      } else {
        setDevAuthError(data.error || 'Failed to update passkey');
      }
    } catch (err: any) {
      setDevAuthError(err.message || 'Passkey update error');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleDeveloperLogout = async () => {
    try {
      if (developerToken) {
        await fetch('/api/developer/logout', {
          method: 'POST',
          headers: { 'x-developer-token': developerToken }
        });
      }
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('agri_dev_token');
    setDeveloperToken(null);
    setIsDeveloperLoggedIn(false);
    setActiveTab('feed');
  };

  // Verify Facebook Page Access Token with Meta Graph API
  const handleVerifyPageToken = async () => {
    if (!inputPageToken.trim()) {
      setTokenVerifyState({ loading: false, result: null, error: 'Please enter a Page Access Token to test.' });
      return;
    }
    setTokenVerifyState({ loading: true, result: null, error: null });
    try {
      const res = await fetch('/api/developer/facebook/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-developer-token': developerToken || ''
        },
        body: JSON.stringify({
          token: inputPageToken.trim(),
          pageId: inputPageId.trim() || pageConfig.pageId
        })
      });
      const data = await res.json();
      if (data.success && data.valid) {
        setTokenVerifyState({ loading: false, result: data, error: null });
      } else {
        setTokenVerifyState({ loading: false, result: null, error: data.error || 'Token verification failed.' });
      }
    } catch (err: any) {
      setTokenVerifyState({ loading: false, result: null, error: err.message || 'Verification network error.' });
    }
  };

  // Save All Facebook Credentials (Admin Only)
  const handleSaveAllAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDeveloperLoggedIn) {
      setConnectionMessage({ type: 'error', text: 'Unauthorized: Developer login required to save credentials.' });
      return;
    }
    setIsConnecting(true);
    setConnectionMessage(null);

    try {
      const res = await fetch('/api/facebook/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-developer-token': developerToken || ''
        },
        body: JSON.stringify({
          pageId: inputPageId || pageConfig.pageId,
          pageName: inputPageName || pageConfig.pageName,
          pageUrl: inputPageUrl || pageConfig.pageUrl,
          pageAccessToken: inputPageToken.trim(),
          publishMode: inputPageToken.trim() ? 'graph_api' : (inputWebhookUrl.trim() ? 'webhook' : 'direct'),
          webhookUrl: inputWebhookUrl.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setPageConfig((prev) => ({
          ...prev,
          pageId: inputPageId || prev.pageId,
          pageName: inputPageName || prev.pageName,
          pageUrl: inputPageUrl || prev.pageUrl,
          webhookUrl: inputWebhookUrl,
          hasPublishPermissions: Boolean(inputPageToken.trim()) || prev.hasPublishPermissions,
          isConnected: true
        }));
        setConnectionMessage({
          type: 'success',
          text: `Credentials saved securely! Facebook Page "${inputPageName || pageConfig.pageName}" is configured.`
        });
      } else {
        setConnectionMessage({ type: 'error', text: data.error || 'Failed to update credentials' });
      }
    } catch (err: any) {
      setConnectionMessage({ type: 'error', text: err.message || 'Network error saving credentials' });
    } finally {
      setIsConnecting(false);
    }
  };

  // Listen for OAuth Popup PostMessage
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setPageConfig((prev) => ({
          ...prev,
          isConnected: true,
          pageName: event.data.pageName || prev.pageName,
          pageId: event.data.pageId || prev.pageId,
          connectedAt: new Date().toISOString()
        }));
        setConnectionMessage({
          type: 'success',
          text: `Connected to Facebook Page "${event.data.pageName || pageConfig.pageName}"!`
        });
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [pageConfig.pageName]);

  // Sync post caption when template or language changes
  useEffect(() => {
    if (postLanguage === 'sn' && selectedTemplate.shonaMessage) {
      setPostCaption(selectedTemplate.shonaMessage);
    } else if (postLanguage === 'nd' && selectedTemplate.ndebeleMessage) {
      setPostCaption(selectedTemplate.ndebeleMessage);
    } else {
      setPostCaption(selectedTemplate.defaultMessage);
    }
  }, [selectedTemplate, postLanguage]);

  // Render Social Card on Canvas (1200x630)
  const drawSocialCard = () => {
    const canvas = postCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#064e3b'); // Emerald-900
    bgGradient.addColorStop(0.6, '#065f46'); // Emerald-800
    bgGradient.addColorStop(1, '#0f172a'); // Slate-900
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric accents
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.beginPath();
    ctx.arc(width - 100, 100, 260, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
    ctx.beginPath();
    ctx.arc(100, height - 100, 220, 0, Math.PI * 2);
    ctx.fill();

    // Gold statutory border stripe
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, width, 12);

    // Header badge
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(70, 60, 380, 42, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('🇿🇼 FARMERS DICTIONARY ZW', 90, 87);

    // Subtitle Authority
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('Ministry of Lands & Agriculture • Agritex Advisory Hub', 480, 87);

    // Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    const words = selectedTemplate.headline.split(' ');
    let line = '';
    let y = 180;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - 180 && n > 0) {
        ctx.fillText(line, 70, y);
        line = words[n] + ' ';
        y += 56;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 70, y);

    // Content highlights card
    y += 40;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(70, y, width - 140, 180, 20);
    ctx.fill();
    ctx.stroke();

    // Data bullet points inside card
    ctx.fillStyle = '#fef08a'; // Amber accent
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(`📍 District: ${currentLocation.name} (Natural Region ${currentLocation.naturalRegion})`, 100, y + 45);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(`• Verified Agritex Standard • DR&SS Certified Registry • Connects to 1-Tap WhatsApp`, 100, y + 90);
    ctx.fillText(`• ${selectedTemplate.callToAction}`, 100, y + 135);

    // Footer bar
    ctx.fillStyle = '#022c22';
    ctx.fillRect(0, height - 70, width, 70);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('📱 Official Facebook Page: @FarmersDictionaryZw', 70, height - 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(`Updated: ${new Date().toLocaleDateString('en-GB')}`, width - 260, height - 28);
  };

  useEffect(() => {
    drawSocialCard();
  }, [selectedTemplate, currentLocation]);

  // Download Social Graphic Card
  const handleDownloadSocialCard = () => {
    const canvas = postCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `facebook-post-${selectedTemplate.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // 1-CLICK EASY POSTING: Copies caption, downloads image, opens Facebook Page composer
  const handleEasyPublishPost = async () => {
    if (!postCaption.trim()) return;
    setIsPublishingPost(true);

    // 1. Copy text to clipboard
    try {
      await navigator.clipboard.writeText(postCaption);
      setIsCopiedPost(true);
    } catch (e) {
      console.warn('Clipboard write warning:', e);
    }

    // 2. Download the social graphic card
    try {
      handleDownloadSocialCard();
    } catch (e) {
      console.warn('Card download warning:', e);
    }

    // 3. Notify backend feed
    try {
      const res = await fetch('/api/facebook/publish-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedTemplate.headline,
          message: postCaption,
          isInteractivePoll: selectedTemplate.interactiveType === 'poll',
          pollOptions: selectedTemplate.pollOptions
        })
      });

      const data = await res.json();
      if (data.success && data.post) {
        setFeed((prev) => [data.post, ...prev]);
      }
    } catch (err: any) {
      console.error('Publishing failed:', err);
    }

    // 4. Determine target Facebook URL
    let targetUrl = pageConfig.pageUrl;
    if (!targetUrl || !targetUrl.includes('facebook.com')) {
      targetUrl = `https://www.facebook.com/${pageConfig.pageId || 'farmersdictionaryzw'}`;
    }

    // 5. Open Facebook Page in new tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    // 6. Show simple instruction modal
    setQuickPostModal({
      isOpen: true,
      title: selectedTemplate.headline,
      targetUrl
    });

    setIsPublishingPost(false);
  };

  // Share via standard Facebook Web Dialog
  const handleShareViaFacebookDialog = () => {
    const shareUrl = window.location.href;
    const dialogUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(postCaption)}`;
    window.open(dialogUrl, '_blank', 'width=600,height=500');
  };

  // Save Simple Page Configuration (No API keys needed)
  const handleSaveSimpleConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setConnectionMessage(null);

    try {
      const res = await fetch('/api/facebook/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageName: inputPageName || 'Farmers Dictionary Zimbabwe',
          pageUrl: inputPageUrl || 'https://facebook.com/farmersdictionaryzw',
          publishMode: 'direct'
        })
      });

      const data = await res.json();
      if (data.success) {
        setPageConfig((prev) => ({
          ...prev,
          pageName: inputPageName || prev.pageName,
          pageUrl: inputPageUrl || prev.pageUrl,
          isConnected: true
        }));
        setConnectionMessage({
          type: 'success',
          text: `Saved! Your posts will now link directly to "${inputPageName}". Zero developer setup needed!`
        });
      }
    } catch (err: any) {
      setConnectionMessage({ type: 'error', text: err.message || 'Could not save page setup' });
    } finally {
      setIsConnecting(false);
    }
  };

  // Save Webhook URL Configuration
  const handleSaveWebhookConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setConnectionMessage(null);

    try {
      const res = await fetch('/api/facebook/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: inputWebhookUrl,
          publishMode: 'webhook'
        })
      });

      const data = await res.json();
      if (data.success) {
        setPageConfig((prev) => ({
          ...prev,
          webhookUrl: inputWebhookUrl,
          publishMode: 'webhook'
        }));
        setConnectionMessage({
          type: 'success',
          text: 'Webhook connected! Posts will automatically trigger your Zapier/Make automation to Facebook.'
        });
      }
    } catch (err: any) {
      setConnectionMessage({ type: 'error', text: err.message || 'Could not save webhook' });
    } finally {
      setIsConnecting(false);
    }
  };

  // AI Content Generator for Posts
  const handleGenerateAiPost = async () => {
    setIsGeneratingAiPost(true);
    try {
      const res = await fetch('/api/facebook/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTemplate.headline,
          type: 'post',
          language: postLanguage,
          extraNotes: `Location: ${currentLocation.name}, Natural Region ${currentLocation.naturalRegion}`
        })
      });

      const data = await res.json();
      if (data.success && data.generated?.content) {
        setPostCaption(data.generated.content);
      }
    } catch (err) {
      console.warn('AI social generator failed:', err);
    } finally {
      setIsGeneratingAiPost(false);
    }
  };

  // Copy Post
  const handleCopyPost = () => {
    navigator.clipboard.writeText(postCaption);
    setIsCopiedPost(true);
    setTimeout(() => setIsCopiedPost(false), 2500);
  };

  // ==================== REELS ENGINE (9:16 VERTICAL VIDEO) ====================
  const activeScene = selectedReel.scenes[currentSceneIndex] || selectedReel.scenes[0];

  // Auto-advance scenes when playing
  useEffect(() => {
    if (!isPlayingReel) {
      if (reelTimerRef.current) clearInterval(reelTimerRef.current);
      return;
    }

    const durationMs = (activeScene.durationSeconds || 10) * 1000;
    const timer = setTimeout(() => {
      setCurrentSceneIndex((prev) => {
        if (prev >= selectedReel.scenes.length - 1) {
          setIsPlayingReel(false);
          return 0; // Loop or stop
        }
        return prev + 1;
      });
    }, durationMs);

    reelTimerRef.current = timer;

    // Speech synthesis voiceover narration
    if (!isVoiceMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const textToSpeak =
          reelVoiceLanguage === 'sn'
            ? activeScene.voiceoverSn
            : reelVoiceLanguage === 'nd'
            ? activeScene.voiceoverNd
            : activeScene.voiceoverEn;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // ignore speech synthesis restrictions
      }
    }

    return () => clearTimeout(timer);
  }, [isPlayingReel, currentSceneIndex, selectedReel, reelVoiceLanguage, isVoiceMuted]);

  // Render 9:16 Reel frame to Canvas
  const drawReelFrame = () => {
    const canvas = reelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 540;
    const h = 960; // 9:16 aspect ratio
    canvas.width = w;
    canvas.height = h;

    // Background gradient based on scene
    const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
    if (activeScene.bgGradient.includes('rose')) {
      bgGradient.addColorStop(0, '#4c0519');
      bgGradient.addColorStop(0.5, '#881337');
      bgGradient.addColorStop(1, '#0f172a');
    } else if (activeScene.bgGradient.includes('amber')) {
      bgGradient.addColorStop(0, '#451a03');
      bgGradient.addColorStop(0.5, '#78350f');
      bgGradient.addColorStop(1, '#064e3b');
    } else if (activeScene.bgGradient.includes('blue')) {
      bgGradient.addColorStop(0, '#172554');
      bgGradient.addColorStop(0.5, '#1e3a8a');
      bgGradient.addColorStop(1, '#0f172a');
    } else {
      bgGradient.addColorStop(0, '#022c22');
      bgGradient.addColorStop(0.5, '#065f46');
      bgGradient.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Top Brand Pill
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.roundRect(30, 45, w - 60, 48, 24);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('🌾 Farmers Dictionary Zw • Facebook Reel', 50, 75);

    // Progress bar across scenes
    const totalScenes = selectedReel.scenes.length;
    const barWidth = (w - 60) / totalScenes;
    for (let i = 0; i < totalScenes; i++) {
      ctx.fillStyle = i <= currentSceneIndex ? '#10b981' : 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.roundRect(30 + i * barWidth, 105, barWidth - 6, 4, 2);
      ctx.fill();
    }

    // Hero Emoji Icon
    ctx.font = '72px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(activeScene.emojiIcon || '🌱', w / 2, 240);

    // Step Badge
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 80, 275, 160, 32, 16);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(`STEP ${activeScene.slideNumber} OF ${totalScenes}`, w / 2, 296);

    // Scene Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.textAlign = 'center';

    const words = activeScene.headline.split(' ');
    let line = '';
    let y = 370;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > w - 80 && n > 0) {
        ctx.fillText(line, w / 2, y);
        line = words[n] + ' ';
        y += 42;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, w / 2, y);

    // Subtext description
    y += 30;
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    const subWords = activeScene.subtext.split(' ');
    let subLine = '';
    for (let n = 0; n < subWords.length; n++) {
      const testLine = subLine + subWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > w - 80 && n > 0) {
        ctx.fillText(subLine, w / 2, y);
        subLine = subWords[n] + ' ';
        y += 24;
      } else {
        subLine = testLine;
      }
    }
    ctx.fillText(subLine, w / 2, y);

    // Kinetic word highlight pills
    y += 50;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.roundRect(40, y, w - 80, 110, 20);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('⚡ KEY ACTION:', w / 2, y + 32);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(activeScene.highlightWords.join('  •  '), w / 2, y + 74);

    // Bottom Sound & WhatsApp CTA
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, h - 120, w, 120);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('🎵 ' + selectedReel.soundtrackLabel, 30, h - 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('💬 Follow for Daily Agritex Updates • @FarmersDictionaryZw', 30, h - 45);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('DR&SS Certified Farming Practice • Natural Regions I - V', 30, h - 22);
  };

  useEffect(() => {
    drawReelFrame();
  }, [selectedReel, currentSceneIndex, activeScene]);

  // Real Video Exporter (Canvas CaptureStream + MediaRecorder -> .webm video file)
  const handleExportReelVideo = async () => {
    const canvas = reelCanvasRef.current;
    if (!canvas) return;

    setIsExportingVideo(true);
    setExportProgress(10);

    try {
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReel.id}-9x16.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExportingVideo(false);
        setExportProgress(100);

        // Open Facebook Reels composer
        window.open('https://business.facebook.com/latest/reels_composer', '_blank');
        setQuickReelModal({
          isOpen: true,
          title: selectedReel.title
        });
      };

      mediaRecorder.start();

      const total = selectedReel.scenes.length;
      for (let i = 0; i < total; i++) {
        setCurrentSceneIndex(i);
        setExportProgress(Math.round(((i + 1) / total) * 90));
        await new Promise((r) => setTimeout(r, 1800));
      }

      mediaRecorder.stop();
    } catch (err) {
      console.error('Video generation failed:', err);
      setIsExportingVideo(false);
    }
  };

  const handleCopyReelCaption = () => {
    const text = `${selectedReel.caption}\n\n${selectedReel.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setIsCopiedReelText(true);
    setTimeout(() => setIsCopiedReelText(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hidden Master Canvases */}
      <canvas ref={postCanvasRef} className="hidden" />

      {/* Meta Facebook Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-700/40">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-6 top-6 hidden lg:block opacity-10 text-9xl pointer-events-none select-none">
          📘
        </div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#1877F2] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <span className="text-sm">f</span>
              <span>Facebook Page Publishing Hub</span>
            </span>

            {isDeveloperLoggedIn ? (
              <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Developer Admin: {developerEmail}</span>
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Developer Protected • Read-Only Visitor Mode</span>
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Connected Page:</span>
                </span>
                <a
                  href={pageConfig.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-200 hover:text-white underline flex items-center gap-1 font-mono"
                >
                  <span>facebook.com/{pageConfig.pageId}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{pageConfig.pageName}</span>
                <span className="text-blue-400 text-lg sm:text-xl" title="Connected Facebook Page">
                  ☑️
                </span>
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Publish daily market price cards, pest outbreak alerts, and 9:16 vertical video Reels straight to your Facebook Page in seconds.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <a
                href={pageConfig.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition flex items-center gap-1.5"
                title="Open your Facebook Page in a new tab"
              >
                <span>View Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {isDeveloperLoggedIn ? (
                <>
                  <button
                    onClick={() => setActiveTab('generator')}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Smart Generator</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('posts')}
                    className="px-3.5 py-2 bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Manual Post</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reels')}
                    className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Reels Studio</span>
                  </button>

                  <button
                    onClick={handleDeveloperLogout}
                    className="px-3 py-2 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    title="Lock developer hub and terminate session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock Hub</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>Developer Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK POST SUCCESS MODAL */}
      {quickPostModal && quickPostModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-center relative">
            <button
              onClick={() => setQuickPostModal(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-inner">
              🚀
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Ready to Post on Facebook!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Everything is prepared for your Facebook Page:
              </p>
            </div>

            {/* Checklist */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Post caption & hashtags automatically copied to clipboard!</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Branded 1200×630 agro graphic card downloaded!</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-900 font-bold">
                <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Facebook Page opened in next tab — just press <strong>Paste (Ctrl+V)</strong> and click Post!</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={handleCopyPost}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isCopiedPost ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Caption Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Caption Again</span>
                  </>
                )}
              </button>

              <a
                href={quickPostModal.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#1877F2] hover:bg-blue-600 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Open Page (1312589948614022)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setQuickPostModal(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK REELS SUCCESS MODAL */}
      {quickReelModal && quickReelModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-center relative">
            <button
              onClick={() => setQuickReelModal(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-3xl shadow-inner">
              🎬
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Reel Video Ready to Share!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your 9:16 vertical video has been rendered and downloaded to your device.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>9:16 Video file (.webm) downloaded!</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reel caption and viral hashtags copied to clipboard!</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-900 font-bold">
                <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Facebook Reels Creator opened — simply drop the video file and paste caption!</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href="https://business.facebook.com/latest/reels_composer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Open Facebook Reels Studio</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setQuickReelModal(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEVELOPER SIGN IN / AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => {
                setShowAuthModal(false);
                setDevAuthError(null);
              }}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shadow-inner shrink-0">
                <Lock className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Developer Admin Access
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Restricted to Lead Developer: <span className="font-mono text-slate-700 font-bold">{developerEmail}</span>
                </p>
              </div>
            </div>

            {/* Auth Mode Tabs: Sign In / Change Passkey */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthViewMode('login');
                  setDevAuthError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  authViewMode === 'login' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthViewMode('register');
                  setDevAuthError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                  authViewMode === 'register' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Change Passkey
              </button>
            </div>

            {/* Feedback Banners */}
            {devAuthError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{devAuthError}</span>
              </div>
            )}
            {devAuthSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{devAuthSuccess}</span>
              </div>
            )}

            {authViewMode === 'login' ? (
              <form onSubmit={handleDeveloperLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Developer Email
                  </label>
                  <input
                    type="email"
                    value={devLoginEmail}
                    onChange={(e) => setDevLoginEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Developer Passkey
                    </label>
                    <span className="text-[10px] text-slate-400">Default: agritex2026</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={devLoginPassword}
                      onChange={(e) => setDevLoginPassword(e.target.value)}
                      placeholder="Enter passkey"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isSubmittingAuth ? 'Verifying Credentials...' : 'Unlock Facebook Controls'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleDeveloperRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Passkey
                  </label>
                  <input
                    type="password"
                    value={currentPasskey}
                    onChange={(e) => setCurrentPasskey(e.target.value)}
                    placeholder="Enter current passkey (e.g. agritex2026)"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Developer Passkey
                  </label>
                  <input
                    type="password"
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Passkey
                  </label>
                  <input
                    type="password"
                    value={confirmPasskey}
                    onChange={(e) => setConfirmPasskey(e.target.value)}
                    placeholder="Repeat new passkey"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Key className="w-4 h-4" />
                  <span>{isSubmittingAuth ? 'Updating...' : 'Save New Passkey'}</span>
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Security Guarded</span>
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setActiveTab('settings');
                }}
                className="text-blue-600 hover:underline font-bold"
              >
                Go to Full Admin Portal →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Published Feed Stream ({feed.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'generator'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Smart Content Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-[#1877F2] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Interactive Post Studio</span>
          {!isDeveloperLoggedIn && (
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
              Draft
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'reels'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels Studio (9:16 Video)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {isDeveloperLoggedIn ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin & Token Manager</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Admin Login & Tokens</span>
            </>
          )}
        </button>
      </div>

      {/* ==================== TAB 1: INTERACTIVE POST STUDIO ==================== */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Template Selection & Caption Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Link to Smart Content Generator */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-base shadow-xs">
                  ✨
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                    Auto-Generate from Crop, Livestock, or Market Data
                  </h4>
                  <p className="text-[11px] text-emerald-800/90 leading-tight">
                    Select a Zimbabwe crop, animal breed, or market to produce instant bilingual posts with WhatsApp CTAs.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('generator')}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Try Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Template Selector Cards */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span>🎯</span>
                  <span>Choose Interactive Post Template</span>
                </h3>
                <span className="text-xs text-slate-500 font-bold">Agritex Directives</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INTERACTIVE_POST_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl)}
                    className={`p-3 rounded-2xl text-left transition border ${
                      selectedTemplate.id === tmpl.id
                        ? 'bg-blue-50/80 border-[#1877F2] ring-2 ring-[#1877F2]/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl block mb-1">{tmpl.icon}</span>
                    <span className="font-black text-xs text-slate-900 block leading-tight">
                      {tmpl.title}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1 block mt-0.5">
                      {tmpl.category.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Post Content & Language Editor */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-800">Post Language:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setPostLanguage('en')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        postLanguage === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => setPostLanguage('sn')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        postLanguage === 'sn' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      🇿🇼 ChiShona
                    </button>
                    <button
                      onClick={() => setPostLanguage('nd')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        postLanguage === 'nd' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      🇿🇼 isiNdebele
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiPost}
                  disabled={isGeneratingAiPost}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Enhance post copy with viral emojis and Agritex guidance using Gemini"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isGeneratingAiPost ? 'Generating...' : 'AI Enhance Copy'}</span>
                </button>
              </div>

              {/* Textarea for Caption */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700">
                  Facebook Post Copy & Hashtags:
                </label>
                <textarea
                  rows={8}
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Write your agro-bulletin, question, or price update..."
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1877F2] font-sans leading-relaxed"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Characters: {postCaption.length}</span>
                  <div className="flex gap-1.5">
                    {selectedTemplate.hashtags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[#1877F2] font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fast 1-Click Publishing Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <span className="font-black text-xs text-blue-950 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Manual Post to Connected Page</span>
                  </span>
                  <p className="text-[11px] text-blue-800/80">
                    Copies text & hashtags, downloads 1200×630 image card, and opens <strong className="font-mono">facebook.com/{pageConfig.pageId}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={pageConfig.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs transition flex items-center gap-1 shrink-0"
                    title="Direct link to your Facebook Page"
                  >
                    <span>Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleEasyPublishPost}
                    disabled={isPublishingPost}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isPublishingPost ? 'Preparing...' : `Post to Page (${pageConfig.pageId})`}</span>
                  </button>
                </div>
              </div>

              {/* Secondary Actions: Quick Dialog + Copy + Download Graphic */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPost}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCopiedPost ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadSocialCard}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                    title="Download 1200x630 social card for Facebook"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Download Image (PNG)</span>
                  </button>
                </div>

                <button
                  onClick={handleShareViaFacebookDialog}
                  className="px-3 py-1.5 text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Facebook Sharer Dialog</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Facebook Feed Mockup Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Live Facebook Feed Preview</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">Audience View</span>
            </div>

            {/* Realistic Facebook Feed Card Mock */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={pageConfig.pictureUrl}
                    alt={pageConfig.pageName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900">
                        {pageConfig.pageName}
                      </h4>
                      <span className="text-[#1877F2] text-xs">☑️</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <span>Just now</span>
                      <span>·</span>
                      <span>🌍 Public</span>
                    </div>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 p-1">
                  •••
                </button>
              </div>

              {/* Post Body */}
              <div className="p-4 space-y-3">
                <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                  {postCaption}
                </p>

                {/* Interactive Poll Component if Poll Template */}
                {selectedTemplate.interactiveType === 'poll' && selectedTemplate.pollOptions && (
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase text-slate-500 block">
                      🗳️ Interactive Facebook Reactions Poll:
                    </span>
                    <div className="space-y-1.5">
                      {selectedTemplate.pollOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between"
                        >
                          <span>{opt}</span>
                          <span className="text-xs text-blue-600 font-bold">Vote</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generated Social Card Image Thumbnail */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[1200/630] bg-slate-900 group">
                  <div className="p-4 text-white h-full flex flex-col justify-between bg-gradient-to-tr from-emerald-950 to-slate-900">
                    <div className="flex items-center justify-between text-[10px] font-black tracking-wider text-emerald-300">
                      <span>FARMERS DICTIONARY ZW</span>
                      <span>{currentLocation.name}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-2xl block">{selectedTemplate.icon}</span>
                      <h4 className="font-black text-sm sm:text-base text-white line-clamp-2">
                        {selectedTemplate.headline}
                      </h4>
                      <p className="text-[10px] text-emerald-200 line-clamp-2">
                        {selectedTemplate.callToAction}
                      </p>
                    </div>

                    <div className="text-[9px] text-slate-400 border-t border-white/10 pt-1 flex justify-between">
                      <span>Agritex Directives</span>
                      <span>Chapter 18:12</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Stats Strip */}
              <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="flex -space-x-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                      👍
                    </span>
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                      ❤️
                    </span>
                  </span>
                  <span className="font-semibold text-slate-700">142</span>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span>38 Comments</span>
                  <span>29 Shares</span>
                </div>
              </div>

              {/* Facebook Action Buttons */}
              <div className="px-2 py-1.5 border-t border-slate-100 grid grid-cols-3 text-slate-600 font-bold text-xs">
                <button className="py-2 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 transition">
                  <ThumbsUp className="w-4 h-4 text-blue-600" />
                  <span>Like</span>
                </button>
                <button className="py-2 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 transition">
                  <MessageCircle className="w-4 h-4 text-slate-500" />
                  <span>Comment</span>
                </button>
                <button className="py-2 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 transition">
                  <Repeat className="w-4 h-4 text-slate-500" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: SMART CONTENT GENERATOR ==================== */}
      {activeTab === 'generator' && (
        <ContentGenerator
          currentLocation={currentLocation}
          targetPageId={pageConfig.pageId}
          onApplyPostToStudio={(caption, headline) => {
            setPostCaption(caption);
            if (headline) {
              setSelectedTemplate((prev) => ({
                ...prev,
                headline
              }));
            }
            setActiveTab('posts');
          }}
          onDirectPublishToPage={async (caption, headline) => {
            setPostCaption(caption);
            if (headline) {
              setSelectedTemplate((prev) => ({
                ...prev,
                headline
              }));
            }
            await handleEasyPublishPost();
          }}
          onOpenWhatsAppModal={onOpenWhatsAppModal}
        />
      )}

      {/* ==================== TAB 3: REELS STUDIO (9:16 VERTICAL VIDEO) ==================== */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Reel Template & Storyboard Scenes (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Reel Template Selection */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span>🎬</span>
                  <span>Select Agricultural Reel Topic</span>
                </h3>
                <span className="text-xs text-rose-600 font-black">9:16 Vertical Video</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FACEBOOK_REELS_TEMPLATES.map((reel) => (
                  <button
                    key={reel.id}
                    onClick={() => {
                      setSelectedReel(reel);
                      setCurrentSceneIndex(0);
                      setIsPlayingReel(false);
                    }}
                    className={`p-3.5 rounded-2xl text-left transition border ${
                      selectedReel.id === reel.id
                        ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-400/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{reel.coverEmoji}</span>
                      <div>
                        <span className="font-black text-xs text-slate-900 block leading-tight">
                          {reel.title}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          ⏱️ {reel.totalDurationSeconds}s • {reel.scenes.length} Scenes
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Storyboard Scene Navigator */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-rose-600" />
                  <span>Storyboard Scenes ({selectedReel.scenes.length} Steps)</span>
                </h4>

                {/* Voiceover Dialect Selection */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-semibold">Audio Narration:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setReelVoiceLanguage('en')}
                      className={`px-2 py-0.5 rounded-lg font-bold text-[11px] ${
                        reelVoiceLanguage === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setReelVoiceLanguage('sn')}
                      className={`px-2 py-0.5 rounded-lg font-bold text-[11px] ${
                        reelVoiceLanguage === 'sn' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      SN
                    </button>
                    <button
                      onClick={() => setReelVoiceLanguage('nd')}
                      className={`px-2 py-0.5 rounded-lg font-bold text-[11px] ${
                        reelVoiceLanguage === 'nd' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      ND
                    </button>
                  </div>
                </div>
              </div>

              {/* Scene Carousel Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedReel.scenes.map((scene, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSceneIndex(idx);
                      setIsPlayingReel(false);
                    }}
                    className={`p-2.5 rounded-2xl text-left border transition ${
                      currentSceneIndex === idx
                        ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-black block">Slide {scene.slideNumber}</span>
                    <span className="text-[10px] line-clamp-1 opacity-90">{scene.headline}</span>
                  </button>
                ))}
              </div>

              {/* Active Scene Script Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-rose-950 uppercase tracking-wider">
                    Scene {activeScene.slideNumber} Voiceover Script:
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    Duration: ~{activeScene.durationSeconds}s
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 font-medium italic bg-white p-3 rounded-xl border border-slate-200">
                  "{reelVoiceLanguage === 'sn'
                    ? activeScene.voiceoverSn
                    : reelVoiceLanguage === 'nd'
                    ? activeScene.voiceoverNd
                    : activeScene.voiceoverEn}"
                </p>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-bold text-slate-500 text-[11px]">On-Screen Keywords:</span>
                  {activeScene.highlightWords.map((w, i) => (
                    <span
                      key={i}
                      className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-lg text-[11px]"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reel Easy 1-Click Action */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <span className="font-black text-xs text-rose-950 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-600" />
                    <span>1-Click Reel Export & Publish</span>
                  </span>
                  <p className="text-[11px] text-rose-800/80">
                    Renders vertical 9:16 video, copies hashtags, and opens Facebook Reels Studio.
                  </p>
                </div>

                <button
                  onClick={handleExportReelVideo}
                  disabled={isExportingVideo}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingVideo ? `Rendering (${exportProgress}%)...` : 'Export Reel & Open Facebook'}</span>
                </button>
              </div>

              {/* Secondary Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                <button
                  onClick={handleCopyReelCaption}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isCopiedReelText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied Caption!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Caption & Hashtags</span>
                    </>
                  )}
                </button>

                <a
                  href="https://business.facebook.com/latest/reels_composer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Open Meta Reels Creator</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 9:16 Vertical Video Player Mockup (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-4">
            <div className="flex items-center justify-between w-full max-w-[340px] px-1 text-xs">
              <span className="font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                <span>9:16 Reel Player</span>
              </span>
              <span className="font-mono text-rose-600 font-bold">
                Scene {currentSceneIndex + 1}/{selectedReel.scenes.length}
              </span>
            </div>

            {/* Smartphone 9:16 Frame */}
            <div className="relative w-full max-w-[340px] aspect-[9/16] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/50 overflow-hidden">
              {/* Internal Canvas / Render Screen */}
              <canvas
                ref={reelCanvasRef}
                className="w-full h-full rounded-[30px] object-cover"
              />

              {/* Floating Player Overlay Controls */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
                <button
                  onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                  className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition hover:bg-black/80"
                  title={isVoiceMuted ? 'Unmute voiceover' : 'Mute voiceover'}
                >
                  {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="px-2.5 py-1 bg-black/60 rounded-full text-[10px] text-white font-mono backdrop-blur-xs">
                  {selectedReel.totalDurationSeconds}s REEL
                </div>
              </div>

              {/* Center Play / Pause Click Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                <button
                  onClick={() => setIsPlayingReel(!isPlayingReel)}
                  className={`w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg ${
                    isPlayingReel ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  {isPlayingReel ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Bottom Reel Quick Navigation */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
                <button
                  onClick={() => {
                    setCurrentSceneIndex((prev) => Math.max(0, prev - 1));
                    setIsPlayingReel(false);
                  }}
                  disabled={currentSceneIndex === 0}
                  className="px-2.5 py-1 rounded-xl bg-black/60 text-white text-[11px] font-bold backdrop-blur-xs disabled:opacity-30"
                >
                  Prev
                </button>

                <button
                  onClick={() => {
                    setCurrentSceneIndex(0);
                    setIsPlayingReel(true);
                  }}
                  className="px-3 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-bold shadow-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentSceneIndex((prev) =>
                      Math.min(selectedReel.scenes.length - 1, prev + 1)
                    );
                    setIsPlayingReel(false);
                  }}
                  disabled={currentSceneIndex === selectedReel.scenes.length - 1}
                  className="px-2.5 py-1 rounded-xl bg-black/60 text-white text-[11px] font-bold backdrop-blur-xs disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: PUBLISHED FEED STREAM ==================== */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <span>📊</span>
                <span>Facebook Published Stream & Insights</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                History of bulletins, interactive polls, and reels dispatched from Farmers Dictionary Zw.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                Total Reach: <strong className="text-slate-900">24,190 farmers</strong>
              </span>
              <a
                href={pageConfig.pageUrl || `https://facebook.com/${pageConfig.pageId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
              >
                <span>Visit Facebook Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {feed.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        post.type === 'reel'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : post.type === 'poll'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {post.type === 'reel' ? '🎬 Reel' : post.type === 'poll' ? '📊 Poll' : '📱 Post'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{post.createdAt}</span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 leading-snug">
                    {post.title}
                  </h4>

                  <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed whitespace-pre-line font-sans">
                    {post.message}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Likes</span>
                      <span className="text-xs font-black text-blue-600">{post.likesCount}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Comments</span>
                      <span className="text-xs font-black text-emerald-600">{post.commentsCount}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Shares</span>
                      <span className="text-xs font-black text-purple-600">{post.sharesCount}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Reach</span>
                      <span className="text-xs font-black text-slate-900">{post.reachCount}</span>
                    </div>
                  </div>

                  {post.permalinkUrl && (
                    <a
                      href={post.permalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <span>View on Facebook</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: ADMIN SETTINGS & CREDENTIALS MANAGER ==================== */}
      {activeTab === 'settings' && !isDeveloperLoggedIn && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 max-w-2xl mx-auto my-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl shadow-inner border border-amber-200">
            🔒
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Developer Security Portal • Restricted Area</span>
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Facebook Token & Integration Settings
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This management page is strictly restricted to the developer (<strong>{developerEmail}</strong>).
              Meta Page Access Tokens, webhooks, and publishing credentials are write-locked to ensure regular users and farmers cannot modify integration settings.
            </p>
          </div>

          {/* Login / Passkey Setup Form Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-left max-w-md mx-auto space-y-4">
            <div className="flex border-b border-slate-200 pb-2.5 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthViewMode('login');
                  setDevAuthError(null);
                }}
                className={`pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                  authViewMode === 'login'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-black'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthViewMode('register');
                  setDevAuthError(null);
                }}
                className={`pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                  authViewMode === 'register'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-black'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Change Passkey</span>
              </button>
            </div>

            {devAuthError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{devAuthError}</span>
              </div>
            )}

            {devAuthSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{devAuthSuccess}</span>
              </div>
            )}

            {authViewMode === 'login' ? (
              <form onSubmit={handleDeveloperLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Developer Admin Email:</label>
                  <input
                    type="email"
                    value={devLoginEmail}
                    onChange={(e) => setDevLoginEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Developer Passkey / Password:</label>
                    <span className="text-[10px] text-slate-400">Default: agritex2026</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter passkey (default: agritex2026)"
                    value={devLoginPassword}
                    onChange={(e) => setDevLoginPassword(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 bg-[#1877F2] hover:bg-blue-600 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isSubmittingAuth ? 'Authenticating...' : 'Sign In as Developer Admin'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleDeveloperRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Developer Email:</label>
                  <input
                    type="email"
                    value={devLoginEmail}
                    onChange={(e) => setDevLoginEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Passkey:</label>
                  <input
                    type="password"
                    placeholder="Current passkey (e.g. agritex2026)"
                    value={currentPasskey}
                    onChange={(e) => setCurrentPasskey(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Secret Passkey:</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Passkey:</label>
                  <input
                    type="password"
                    placeholder="Confirm new passkey"
                    value={confirmPasskey}
                    onChange={(e) => setConfirmPasskey(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Key className="w-4 h-4" />
                  <span>{isSubmittingAuth ? 'Updating...' : 'Save New Passkey & Log In'}</span>
                </button>
              </form>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('feed')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <span>Return to Public Advisory Feed (Read-Only)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: DEVELOPER AUTHENTICATED CREDENTIALS MANAGER ==================== */}
      {activeTab === 'settings' && isDeveloperLoggedIn && (
        <div className="space-y-6">
          {/* Top Admin Status Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Developer Admin Portal
                  </h3>
                  <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                    Authenticated
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Logged in as <strong className="text-emerald-300 font-mono">{developerEmail}</strong> • Meta API credentials unlocked for editing.
                </p>
              </div>
            </div>

            <button
              onClick={handleDeveloperLogout}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer self-stretch sm:self-auto justify-center"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock & Sign Out</span>
            </button>
          </div>

          {/* Feedback Notice */}
          {connectionMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
                connectionMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-50 text-rose-900 border border-rose-300'
              }`}
            >
              {connectionMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{connectionMessage.text}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSaveAllAdminCredentials} className="space-y-6">
            {/* CARD 1: META GRAPH API & PAGE ACCESS TOKEN */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-blue-100 text-[#1877F2] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                    Primary Meta Credentials
                  </span>
                  <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#1877F2]" />
                    <span>Facebook Page Access Token & Target Page</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure the exact Page ID and Graph API Page Access Token with <code className="text-blue-600 font-bold">pages_manage_posts</code> permissions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                    inputPageToken.trim()
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${inputPageToken.trim() ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <span>{inputPageToken.trim() ? 'Token Provided' : 'Token Not Set'}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Target Facebook Page ID:
                  </label>
                  <input
                    type="text"
                    value={inputPageId}
                    onChange={(e) => setInputPageId(e.target.value)}
                    placeholder="1312589948614022"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    required
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Your Page ID: <strong className="text-slate-700">1312589948614022</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Facebook Page Name:
                  </label>
                  <input
                    type="text"
                    value={inputPageName}
                    onChange={(e) => setInputPageName(e.target.value)}
                    placeholder="Farmers Dictionary Zimbabwe"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Target Facebook Page URL:
                  </label>
                  <input
                    type="url"
                    value={inputPageUrl}
                    onChange={(e) => setInputPageUrl(e.target.value)}
                    placeholder="https://www.facebook.com/1312589948614022"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>

                {/* Secret Page Access Token Field */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-black text-slate-800">
                      Meta Page Access Token (EAA...):
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {showToken ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Mask Token</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Reveal Token</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={inputPageToken}
                      onChange={(e) => {
                        setInputPageToken(e.target.value);
                        setTokenVerifyState({ loading: false, result: null, error: null });
                      }}
                      placeholder="Paste Meta Page Access Token (starts with EAA...)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={handleVerifyPageToken}
                      disabled={tokenVerifyState.loading || !inputPageToken.trim()}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${tokenVerifyState.loading ? 'animate-spin' : ''}`} />
                      <span>{tokenVerifyState.loading ? 'Verifying...' : 'Test Token'}</span>
                    </button>
                  </div>

                  {/* Token Verification Feedback */}
                  {tokenVerifyState.result && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span>{tokenVerifyState.result.message}</span>
                        {tokenVerifyState.result.pageName && (
                          <span className="block text-[11px] font-normal text-emerald-800 mt-0.5">
                            Page Name: <strong>{tokenVerifyState.result.pageName}</strong> • Fans: {tokenVerifyState.result.fanCount || 'N/A'} • Category: {tokenVerifyState.result.category || 'Agricultural'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {tokenVerifyState.error && (
                    <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs font-bold flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{tokenVerifyState.error}</span>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 block">💡 How to generate a Page Token in 2 minutes:</span>
                    <p>1. Open <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Meta Graph API Explorer ↗</a>.</p>
                    <p>2. Under <strong>User or Page</strong>, select your Page (<code className="font-mono font-bold">1312589948614022</code>).</p>
                    <p>3. Add permissions: <code className="font-mono text-emerald-800 font-bold">pages_manage_posts</code> and <code className="font-mono text-emerald-800 font-bold">pages_read_engagement</code>.</p>
                    <p>4. Click <strong>Generate Access Token</strong> and paste it here.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: AUTOMATION & WEBHOOKS */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                  Automated Webhook & RSS Dispatch
                </span>
                <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>Webhook & RSS Endpoints</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Webhook Destination URL (Zapier / Make / Buffer):
                  </label>
                  <input
                    type="url"
                    value={inputWebhookUrl}
                    onChange={(e) => setInputWebhookUrl(e.target.value)}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Posts are dispatched via JSON POST payload to this webhook.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Live RSS 2.0 Feed for Buffer / Dlvr.it (Autopilot):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={rssFeedUrl}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-emerald-800 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(rssFeedUrl);
                        alert('RSS Feed URL copied to clipboard!');
                      }}
                      className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition shrink-0 cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SAVE ALL CREDENTIALS ACTION */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-900 block">Encrypted Save Protocol:</span>
                <span>Credentials are stored on the server and verified via developer token header.</span>
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full sm:w-auto px-6 py-3 bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isConnecting ? 'Saving Credentials...' : 'Save & Protect All Credentials'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
