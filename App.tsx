import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import html2canvas from 'html2canvas';
import { toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, Rocket, Pencil, Puzzle, Lightbulb, Trophy, 
  MessageCircle, X, Send, Bot, 
  GraduationCap, Sparkles, Download, Loader2, Image as ImageIcon, 
  Gamepad2, Tablet, Clock, Ruler, Calculator, Backpack, BookHeart, 
  Shapes, FileImage, Palette, PenTool, FileCode 
} from 'lucide-react';

// --- 1. TYPES ---

interface CourseLevelData {
  level: number;
  pricePerTerm: number;
  tablets: number;
  software: number;
  total: number;
}

interface CourseCategory {
  name: string;
  themeColor: string;
  textColor: string;
  borderColor: string;
  bgGradient: string;
  levels: CourseLevelData[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- 2. CONSTANTS ---

const SCHOOL_NAME = "ELiF";

const PRICING_DATA: CourseCategory[] = [
  {
    name: "Starter",
    themeColor: "bg-pink-400",
    textColor: "text-pink-600",
    borderColor: "border-pink-200",
    bgGradient: "from-pink-50 to-pink-100",
    levels: [
      { level: 1, pricePerTerm: 45, tablets: 130, software: 10, total: 185 },
      { level: 2, pricePerTerm: 45, tablets: 0, software: 10, total: 55 },
      { level: 3, pricePerTerm: 45, tablets: 0, software: 10, total: 55 },
      { level: 4, pricePerTerm: 45, tablets: 0, software: 10, total: 55 },
    ]
  },
  {
    name: "Jumper",
    themeColor: "bg-orange-400",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    bgGradient: "from-orange-50 to-orange-100",
    levels: [
      { level: 1, pricePerTerm: 50, tablets: 0, software: 10, total: 60 },
      { level: 2, pricePerTerm: 50, tablets: 0, software: 10, total: 60 },
      { level: 3, pricePerTerm: 50, tablets: 0, software: 10, total: 60 },
      { level: 4, pricePerTerm: 50, tablets: 0, software: 10, total: 60 },
    ]
  },
  {
    name: "Basic",
    themeColor: "bg-yellow-400",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    bgGradient: "from-yellow-50 to-yellow-100",
    levels: [
      { level: 1, pricePerTerm: 55, tablets: 0, software: 10, total: 65 },
      { level: 2, pricePerTerm: 55, tablets: 0, software: 10, total: 65 },
      { level: 3, pricePerTerm: 55, tablets: 0, software: 10, total: 65 },
      { level: 4, pricePerTerm: 55, tablets: 0, software: 10, total: 65 },
    ]
  },
  {
    name: "Intermediate",
    themeColor: "bg-green-400",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    bgGradient: "from-green-50 to-green-100",
    levels: [
      { level: 1, pricePerTerm: 60, tablets: 0, software: 10, total: 70 },
      { level: 2, pricePerTerm: 60, tablets: 0, software: 10, total: 70 },
      { level: 3, pricePerTerm: 60, tablets: 0, software: 10, total: 70 },
      { level: 4, pricePerTerm: 60, tablets: 0, software: 10, total: 70 },
    ]
  },
  {
    name: "Advanced",
    themeColor: "bg-blue-400",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    bgGradient: "from-blue-50 to-blue-100",
    levels: [
      { level: 1, pricePerTerm: 65, tablets: 0, software: 10, total: 75 },
      { level: 2, pricePerTerm: 65, tablets: 0, software: 10, total: 75 },
      { level: 3, pricePerTerm: 65, tablets: 0, software: 10, total: 75 },
      { level: 4, pricePerTerm: 65, tablets: 0, software: 10, total: 75 },
    ]
  },
  {
    name: "Elite",
    themeColor: "bg-purple-400",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    bgGradient: "from-purple-50 to-purple-100",
    levels: [
      { level: 1, pricePerTerm: 70, tablets: 0, software: 10, total: 80 },
      { level: 2, pricePerTerm: 70, tablets: 0, software: 10, total: 80 },
      { level: 3, pricePerTerm: 70, tablets: 0, software: 10, total: 80 },
      { level: 4, pricePerTerm: 70, tablets: 0, software: 10, total: 80 },
    ]
  },
];

const SYSTEM_INSTRUCTION = `
You are a helpful and friendly academic advisor for ELiF School.
Your goal is to assist parents in understanding the school's tuition and fees.

Here is the official Price List Data:
${JSON.stringify(PRICING_DATA, null, 2)}

Key Rules:
1. Tone: Cheerful, professional, and encouraging. Suitable for a school environment.
2. Facts: ONLY use the provided JSON data for prices. Do not make up prices.
3. Specifics: Note that "Starter Level 1" is the only course with a $130 Tablet fee. All other courses have a $0 tablet fee.
4. Formatting: When listing prices, use a clean format.
5. If asked about "Term length", mention it is 45 hours per term.
6. Keep answers concise (under 100 words) unless detailed breakdown is requested.
`;

// --- 3. SERVICES ---

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    if (!process.env.API_KEY) {
      console.warn("API_KEY not found in environment variables");
    }
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

const generateResponse = async (userMessage: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error querying Gemini:", error);
    return "Oops! I'm having trouble connecting to the school database right now. Please try again later.";
  }
};

// --- 4. COMPONENTS ---

interface CourseCardProps {
  category: CourseCategory;
}

const CourseCard: React.FC<CourseCardProps> = ({ category }) => {
  const getIcon = () => {
    switch (category.name) {
      case 'Starter': return Puzzle;
      case 'Jumper': return Rocket;
      case 'Basic': return Pencil;
      case 'Intermediate': return BookOpen;
      case 'Advanced': return Lightbulb;
      case 'Elite': return Trophy;
      default: return BookOpen;
    }
  };

  const Icon = getIcon();

  return (
    <article className={`rounded-3xl overflow-hidden shadow-lg border-2 ${category.borderColor} bg-white transform transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full`}>
      {/* Card Header */}
      <header className={`${category.themeColor} p-4 flex items-center justify-between text-white`}>
        <div className="flex items-center gap-2">
          <Icon size={24} className="text-white/90" aria-hidden="true" />
          <h3 className="text-2xl bubble-font tracking-wide">{category.name}</h3>
        </div>
        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider border border-white/20">
          4 Levels
        </span>
      </header>

      {/* Card Body */}
      <div className={`p-4 flex-grow ${category.bgGradient}`}>
        <ul className="grid gap-4 list-none p-0 m-0">
          {category.levels.map((levelData) => (
            <li 
              key={levelData.level} 
              className="bg-white/95 rounded-xl p-3 border border-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2 border-b border-dashed border-gray-200 pb-2">
                {/* Level Badge */}
                <div className={`h-7 px-4 rounded-full flex items-center justify-center text-xs font-black uppercase tracking-wider text-white ${category.themeColor} shadow-sm min-w-[85px] whitespace-nowrap`}>
                  LEVEL {levelData.level}
                </div>
                <span className="text-xl font-black text-gray-800">
                  ${levelData.total.toFixed(2)}
                </span>
              </div>
              
              <dl className="text-xs text-gray-600 space-y-1 m-0">
                <div className="flex justify-between">
                  <dt>Tuition (45h):</dt>
                  <dd className="font-medium">${levelData.pricePerTerm}</dd>
                </div>
                <div className={`flex justify-between ${levelData.tablets > 0 ? 'text-red-500 font-bold' : ''}`}>
                  <dt>Tablet Fee:</dt>
                  <dd>
                    {levelData.tablets > 0 ? `$${levelData.tablets}` : 'Included'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Software:</dt>
                  <dd className="font-medium">${levelData.software}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Footer */}
      <footer className="bg-white p-3 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400 font-medium">
          Prices are per term (45 hours)
        </p>
      </footer>
    </article>
  );
};

const ChatAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm the ELiF Course Advisor. Ask me about prices, levels, or which course is right for your child!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const aiResponseText = await generateResponse(userText);

    setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
    setIsLoading(false);
  };

  return (
    <aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans" aria-label="Virtual Advisor">
      {/* Chat Window */}
      {isOpen && (
        <div 
          role="dialog" 
          aria-label="Chat with Advisor"
          className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-indigo-100 transform transition-all origin-bottom-right"
        >
          {/* Header */}
          <header className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-sm">ELiF Advisor</h3>
                <p className="text-xs text-indigo-200">Powered by Gemini</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" role="log" aria-live="polite">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start" aria-label="Advisor is typing">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <footer className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about specific prices..."
                className="bg-transparent flex-1 outline-none text-sm text-gray-700"
                disabled={isLoading}
                aria-label="Type your question"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className={`p-2 rounded-full transition-colors ${
                  isLoading || !input.trim() 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat advisor" : "Open chat advisor"}
        aria-expanded={isOpen}
        aria-controls="chat-window"
        className={`${isOpen ? 'bg-indigo-500 rotate-90' : 'bg-indigo-600'} text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center group`}
      >
        {isOpen ? <X size={28} aria-hidden="true" /> : <MessageCircle size={28} className="group-hover:scale-110 transition-transform" aria-hidden="true" />}
      </button>
    </aside>
  );
};

// --- 5. MAIN APP ---

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDocument = async (format: 'pdf' | 'ai') => {
    const element = document.getElementById('pricing-content');
    if (!element) return;

    setIsGenerating(true);
    try {
      // Force desktop width (1400px) to capture the 3-column grid layout
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#2e2a5b', // Match app background
        windowWidth: 1400, // Force desktop layout
        logging: false,
        onclone: (doc) => {
            // Ensure no layout shifts happen in the clone
            const badges = doc.querySelectorAll('.whitespace-nowrap');
            badges.forEach((el) => (el as HTMLElement).style.display = 'flex');
        }
      });

      // Initialize PDF (A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // 10mm margin for clean edges
      
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate dimensions to fit the page (contain) within margins
      const widthRatio = availableWidth / imgWidth;
      const heightRatio = availableHeight / imgHeight;
      const ratio = Math.min(widthRatio, heightRatio);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      // Center vertically and horizontally on the page
      const xPos = (pdfWidth - finalWidth) / 2;
      const yPos = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', xPos, yPos, finalWidth, finalHeight);
      
      // Save as .pdf or .ai (Illustrator opens PDFs natively)
      pdf.save(`ELiF-School-Price-List.${format}`);
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()}:`, error);
      alert(`Could not generate ${format.toUpperCase()}. Please try printing the page instead.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadJPG = async () => {
    const element = document.getElementById('pricing-content');
    if (!element) return;

    setIsGenerating(true);
    try {
      // Same config as PDF to ensure consistent look
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#2e2a5b', // Match app background
        windowWidth: 1400, // Force desktop layout
        logging: false,
        onclone: (doc) => {
            // Ensure no layout shifts happen in the clone
            const badges = doc.querySelectorAll('.whitespace-nowrap');
            badges.forEach((el) => (el as HTMLElement).style.display = 'flex');
        }
      });

      const image = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = 'ELiF-School-Illustration.jpg';
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating JPG:', error);
      alert('Could not generate JPG.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSVG = async () => {
    const element = document.getElementById('pricing-content');
    if (!element) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toSvg(element, {
        backgroundColor: '#2e2a5b',
        // This helps ensure external images/fonts are processed correctly
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = 'ELiF-School-Pricing.svg';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating SVG:', error);
      alert('Could not generate SVG.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2e2a5b] text-gray-800 selection:bg-cyan-200 selection:text-indigo-900 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#2e2a5b]/95 backdrop-blur-md border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 select-none">
            <div className="relative">
              <h1 className="text-4xl font-black text-white tracking-tighter font-[Nunito]">
                EL<span className="relative inline-block">i<span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span></span>F
              </h1>
            </div>
          </div>
          
          <nav aria-label="Export Options" className="flex items-center gap-3">
             <button 
                onClick={handleDownloadJPG}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 text-sm"
                title="Download as Image"
                aria-label="Download as JPG Image"
             >
                {isGenerating ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <ImageIcon size={16} aria-hidden="true" />}
                <span className="hidden lg:inline">JPG</span>
             </button>
             
             <button 
                onClick={() => generateDocument('pdf')}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white px-3 py-2 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20 text-sm"
                title="Download as PDF"
                aria-label="Download as PDF"
             >
                {isGenerating ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
                <span className="hidden lg:inline">PDF</span>
             </button>

             <button 
                onClick={handleDownloadSVG}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-3 py-2 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 text-sm"
                title="Download as SVG (Vector)"
                aria-label="Download as SVG Vector"
             >
                {isGenerating ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <FileCode size={16} aria-hidden="true" />}
                <span className="hidden lg:inline">SVG</span>
             </button>

             <button 
                onClick={() => generateDocument('ai')}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20 text-sm"
                title="Download for Adobe Illustrator"
                aria-label="Download for Adobe Illustrator"
             >
                {isGenerating ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <PenTool size={16} aria-hidden="true" />}
                <span className="hidden lg:inline">Illustrator</span>
             </button>
          </nav>
        </div>
      </header>

      <main id="pricing-content" className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 relative overflow-hidden">
        {/* Background Decoration Elements - Hidden from screen readers */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
           <Ruler className="absolute top-20 -left-4 text-white/5 -rotate-45" size={140} />
           <Calculator className="absolute top-32 -right-4 text-white/5 rotate-12" size={120} />
           <Backpack className="absolute bottom-40 left-10 text-white/5 rotate-12 hidden md:block" size={160} />
           <BookHeart className="absolute top-1/3 right-20 text-white/5 -rotate-12 hidden lg:block" size={130} />
           <Shapes className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 opacity-30 scale-150" size={500} />
           <FileImage className="absolute bottom-20 right-10 text-white/5 -rotate-6 hidden sm:block" size={100} />
           <Palette className="absolute top-1/4 left-10 text-white/5 rotate-45 hidden md:block" size={90} />
        </div>

        {/* Hero Title */}
        <section aria-labelledby="hero-heading" className="text-center mb-12 pt-4 relative z-10">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 mb-6 backdrop-blur-sm border border-white/10 shadow-inner">
            <GraduationCap size={48} className="text-cyan-400" aria-hidden="true" />
          </div>
          <h2 id="hero-heading" className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight bubble-font drop-shadow-lg">
            Building the <span className="text-cyan-400 relative inline-block">Future<Sparkles className="absolute -top-4 -right-6 text-yellow-400 w-8 h-8 animate-bounce" aria-hidden="true" /></span>
          </h2>
          <p className="text-lg md:text-xl text-indigo-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Ignite your child's potential with our fun, structured, and interactive learning paths.
          </p>
        </section>

        {/* Course Grid */}
        <section aria-label="Course Pricing Options">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 relative z-10 list-none p-0">
            {PRICING_DATA.map((category) => (
              <li key={category.name} className="h-full">
                <CourseCard category={category} />
              </li>
            ))}
          </ul>
        </section>

        {/* Additional Info Section */}
        <section aria-label="Key Features" className="mt-16 bg-indigo-900/40 rounded-3xl p-8 border border-white/10 backdrop-blur-sm shadow-xl relative z-10">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white list-none p-0">
            <li className="bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center gap-5 hover:bg-white/10 transition-colors">
              <div className="bg-indigo-500/20 p-4 rounded-2xl text-indigo-300">
                <Clock size={32} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1">45 Hours</h4>
                <p className="text-indigo-200 text-sm font-medium">Standard Term Duration</p>
              </div>
            </li>
            
            <li className="bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center gap-5 hover:bg-white/10 transition-colors">
              <div className="bg-purple-500/20 p-4 rounded-2xl text-purple-300">
                <Tablet size={32} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1">Interactive</h4>
                <p className="text-indigo-200 text-sm font-medium">Tablet Enhanced Learning</p>
              </div>
            </li>

            <li className="bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center gap-5 hover:bg-white/10 transition-colors">
              <div className="bg-cyan-500/20 p-4 rounded-2xl text-cyan-300">
                <Gamepad2 size={32} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1">Fun Learning</h4>
                <p className="text-indigo-200 text-sm font-medium">Game-based Software</p>
              </div>
            </li>
          </ul>
        </section>
      </main>

      <ChatAdvisor />
    </div>
  );
};

export default App;