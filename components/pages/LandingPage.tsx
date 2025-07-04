'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Check, 
  Star, 
  Globe, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import VideoModal from '@/components/ui/VideoModal';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [videoModal, setVideoModal] = useState({ isOpen: false, url: '', title: '' });

  // 语言切换
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  // 打开视频
  const openVideo = (url: string, title: string) => {
    setVideoModal({ isOpen: true, url, title });
  };

  // 关闭视频
  const closeVideo = () => {
    setVideoModal({ isOpen: false, url: '', title: '' });
  };

  // 用户见证数据
  const testimonials = [
    {
      name: "Dr. Andrew Ng",
      role: "AI Pioneer, Stanford & Coursera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quote: "MindPulse represents the future of personalized AI. The knowledge graph generation is remarkably sophisticated, creating genuine digital twins that learn and evolve.",
      rating: 5
    },
    {
      name: "Reid Hoffman",
      role: "Co-founder LinkedIn, Partner Greylock",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
      quote: "The Quantum Decisions feature is a game-changer for entrepreneurs. It's like having a strategic advisor that never sleeps, processing complex scenarios with unprecedented clarity.",
      rating: 5
    },
    {
      name: "Arianna Huffington",
      role: "Founder Thrive Global",
      avatar: "https://images.unsplash.com/photo-1594736797933-d0a9ba9a3e6e?w=100&h=100&fit=crop&crop=face",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quote: "MindPulse doesn't just create a digital twin—it creates a digital mentor. My Spirit Corridor avatar helps thousands while I focus on strategic initiatives. It's transformational.",
      rating: 5
    }
  ];

  // 功能特色数据
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      key: 'aiCore',
      color: 'from-blue-500 to-purple-600',
      demo: '/ai-exploration'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      key: 'spiritCorridor', 
      color: 'from-purple-500 to-pink-600',
      demo: '/spirit-corridor'
    },
    {
      icon: <Target className="w-8 h-8" />,
      key: 'quantumDecisions',
      color: 'from-pink-500 to-red-600',
      demo: '/quantum-decisions'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      key: 'assetAllocation',
      color: 'from-green-500 to-blue-600',
      demo: '/asset-allocation'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MindPulse
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                {t('common.features')}
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                {t('common.pricing')}
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                {t('common.testimonials')}
              </a>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{i18n.language === 'en' ? 'EN' : '中文'}</span>
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                {t('common.signIn')}
              </button>
              <a href="/consciousness-hub" className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                {t('common.getStarted')}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-lg border-t border-gray-800"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-gray-300 hover:text-white">
                  {t('common.features')}
                </a>
                <a href="#pricing" className="block text-gray-300 hover:text-white">
                  {t('common.pricing')}
                </a>
                <a href="#testimonials" className="block text-gray-300 hover:text-white">
                  {t('common.testimonials')}
                </a>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white"
                >
                  <Globe className="w-4 h-4" />
                  <span>{i18n.language === 'en' ? 'EN' : '中文'}</span>
                </button>
                <button className="block w-full text-left text-gray-300 hover:text-white">
                  {t('common.signIn')}
                </button>
                <a href="/consciousness-hub" className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-center">
                  {t('common.getStarted')}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {t('hero.title')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {t('hero.subtitle')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="/consciousness-hub"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>{t('hero.cta')}</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.a>
                
                <motion.button
                  onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', 'MindPulse Introduction')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-gray-600 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 transition-all flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>{t('hero.watchIntro')}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Demo Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('hero.videoSection.title')}
              </span>
            </h2>
            <p className="text-lg text-gray-300">
              {t('hero.videoSection.subtitle')}
            </p>
          </div>

          <div className="relative group cursor-pointer" onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', 'MindPulse Product Demo')}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 aspect-video">
              {/* Video Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('hero.videoSection.demoTitle')}</h3>
                  <p className="text-gray-300">{t('hero.videoSection.duration')}</p>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('common.features')}
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Four powerful modules to transform your digital existence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  
                  <p className="text-lg text-blue-400 mb-4 font-semibold">
                    {t(`features.${feature.key}.subtitle`)}
                  </p>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {(t(`features.${feature.key}.benefits`, { returnObjects: true }) as string[]).map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-center space-x-2 text-gray-300">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex space-x-3">
                    <a
                      href="/consciousness-hub"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-center"
                    >
                      {t('common.tryFree')}
                    </a>
                    <a
                      href={feature.demo}
                      className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-400 transition-all"
                    >
                      <Play className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('common.pricing')}
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that fits your transformation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{t('pricing.basic.title')}</h3>
                <div className="text-4xl font-bold mb-2">
                  <span className="text-green-400">{t('pricing.basic.price')}</span>
                </div>
                <p className="text-gray-400">{t('pricing.basic.duration')}</p>
                <p className="text-gray-300 mt-4">{t('pricing.basic.description')}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {(t('pricing.basic.features', { returnObjects: true }) as string[]).map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/consciousness-hub"
                className="block w-full bg-gradient-to-r from-green-500 to-blue-600 px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all font-semibold text-center"
              >
                {t('common.tryFree')}
              </a>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/50 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1 rounded-full text-sm font-semibold">
                  {t('common.popular')}
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{t('pricing.pro.title')}</h3>
                <div className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {t('pricing.pro.price')}
                  </span>
                  <span className="text-lg text-gray-400">{t('pricing.pro.duration')}</span>
                </div>
                <p className="text-gray-300 mt-4">{t('pricing.pro.description')}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {(t('pricing.pro.features', { returnObjects: true }) as string[]).map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/consciousness-hub"
                className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-center"
              >
                {t('common.upgrade')}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('testimonials.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-800"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                
                <button 
                  onClick={() => openVideo(testimonial.video, `${testimonial.name} - ${testimonial.role}`)}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>{t('common.watchDemo')}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Transform?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands who've already started their digital evolution journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/consciousness-hub"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {t('common.getStarted')} - {t('common.free')}
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-gray-600 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 transition-all"
            >
              {t('common.contact')}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MindPulse
              </span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>© 2024 MindPulse. All rights reserved.</p>
              <p className="text-sm mt-1">Your Mind, Amplified. Your Future, Simplified.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideo}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
};

export default LandingPage;