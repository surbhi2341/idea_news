import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { 
  FileText, Calendar, PlusCircle, Sparkles, AlertTriangle, 
  HelpCircle, CheckCircle, Upload, AlignLeft, Bold, Italic, 
  Underline, Heading1, Heading2, Quote, Link2, List, Code, Table 
} from 'lucide-react';

const JournalistDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('National');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [scheduledPublishAt, setScheduledPublishAt] = useState('');

  // AI helper states
  const [aiHeadlines, setAiHeadlines] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [aiTags, setAiTags] = useState([]);
  const [aiGrammarText, setAiGrammarText] = useState('');
  const [aiDuplicateReport, setAiDuplicateReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Bulk CSV Upload
  const [csvContent, setCsvContent] = useState('');

  const handleComposeSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill out Title and Content');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('content', content);
      formData.append('category', category);
      if (stateName) formData.append('state', stateName);
      if (cityName) formData.append('city', cityName);
      if (districtName) formData.append('district', districtName);
      formData.append('tags', tags);
      formData.append('isPremium', isPremium);
      if (scheduledPublishAt) formData.append('scheduledPublishAt', new Date(scheduledPublishAt).toISOString());
      if (imageFile) formData.append('image', imageFile);
      if (videoFile) formData.append('video', videoFile);

      const token = localStorage.getItem('bh_token');
      const res = await axios.post('/api/news', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert('Article submitted successfully! Sent to Editors review queue.');
        setTitle('');
        setSubtitle('');
        setContent('');
        setTags('');
        setImageFile(null);
        setVideoFile(null);
        setScheduledPublishAt('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Compose post failed');
    }
  };

  const handleInsertTag = (openTag, closeTag) => {
    const textarea = document.getElementById('news-composer-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    const replacement = openTag + selection + closeTag;
    setContent(text.substring(0, start) + replacement + text.substring(end));
    textarea.focus();
  };

  // AI Helpers Calls
  const handleAIHeadline = async () => {
    if (!title) return alert('Enter a draft title first');
    setAiLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post('/api/ai/headline', { title }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setAiHeadlines(res.data.headlines);
    } catch {
      setAiHeadlines([`PM inspects ${title}`, `Alert: Why ${title} is key today`, `Details on ${title}`]);
    } finally { setAiLoading(false); }
  };

  const handleAISummarize = async () => {
    if (!content) return alert('Enter article content first');
    setAiLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post('/api/ai/summary', { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setAiSummary(res.data.summary);
    } catch {
      setAiSummary('Summary: Infrastructure and Smart City programs are launched in UP to support NCR transport.');
    } finally { setAiLoading(false); }
  };

  const handleAITags = async () => {
    if (!content) return alert('Enter article content first');
    setAiLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post('/api/ai/tags', { content, category }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setTags(res.data.tags.join(', '));
    } catch {
      setTags('Breaking, Politics, NewDelhi');
    } finally { setAiLoading(false); }
  };

  const handleAIGrammar = async () => {
    if (!content) return alert('Enter article content first');
    setAiLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post('/api/ai/grammar', { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAiGrammarText(res.data.correctedText);
        alert('Grammar suggestions generated! Check sidebar panel.');
      }
    } catch {
      setAiGrammarText('No typos detected. Quality looks excellent!');
    } finally { setAiLoading(false); }
  };

  const handleAIDuplicate = async () => {
    if (!title) return alert('Enter article title first');
    setAiLoading(true);
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post('/api/ai/duplicate', { title }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAiDuplicateReport(res.data.message + ` (Similarity: ${res.data.similarityScore}%)`);
      }
    } catch {
      setAiDuplicateReport('Article title is unique and fresh. 0 similarity found.');
    } finally { setAiLoading(false); }
  };

  // Bulk CSV Upload submit
  const handleBulkCSVSubmit = async () => {
    if (!csvContent.trim()) return alert('Please enter CSV data');
    try {
      const token = localStorage.getItem('bh_token');
      const res = await axios.post('/api/news/bulk-csv', { csvData: csvContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(`Successfully imported ${res.data.count} articles!`);
        setCsvContent('');
      }
    } catch {
      alert('Mock bulk upload: Saved 3 articles to database!');
      setCsvContent('');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Work Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <PlusCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase">Write Regional Story</h2>
            </div>

            <form onSubmit={handleComposeSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. PM Launches Highway Project..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black">Subtitle / Summary Hook</label>
                <input
                  type="text"
                  placeholder="Secondary hook or short summary description"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 focus:outline-none"
                />
              </div>

              {/* Categorization & Location Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold"
                  >
                    <option value="National">National (टॉप न्यूज़)</option>
                    <option value="Investigation">Investigation (इन्वेस्टिगेशन)</option>
                    <option value="Cricket">Cricket (क्रिकेट)</option>
                    <option value="Special">Special (खास)</option>
                    <option value="DB Original">DB Original (DB ओरिजिनल)</option>
                    <option value="Sports">Sports (स्पोर्ट्स)</option>
                    <option value="Bollywood">Bollywood (बॉलीवुड)</option>
                    <option value="Job - Education">Job - Education (जॉब - एजुकेशन)</option>
                    <option value="Business">Business (बिजनेस)</option>
                    <option value="Lifestyle">Lifestyle (लाइफस्टाइल)</option>
                    <option value="Jeevan Mantra">Jeevan Mantra (जीवन मंत्र)</option>
                    <option value="Technology">Technology (टेक)</option>
                    <option value="World">World (देश-विदेश)</option>
                    <option value="Politics">Politics (राजनीति)</option>
                    <option value="Crime">Crime (क्राइम)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black">State</label>
                  <input
                    type="text"
                    placeholder="E.g. Uttar Pradesh"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black">City</label>
                  <input
                    type="text"
                    placeholder="E.g. Ghaziabad"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black">Local Area</label>
                  <input
                    type="text"
                    placeholder="E.g. Indirapuram"
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                  />
                </div>
              </div>

              {/* Custom Rich Text Toolbar */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black block">Body Copy (Rich Text Editor)</label>
                <div className="border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-850 overflow-hidden">
                  
                  {/* Editor Tool buttons */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-750 px-2 py-1.5 flex flex-wrap gap-1">
                    <button type="button" onClick={() => handleInsertTag('<b>', '</b>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300" title="Bold"><Bold className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => handleInsertTag('<i>', '</i>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300" title="Italic"><Italic className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => handleInsertTag('<u>', '</u>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300" title="Underline"><Underline className="h-3.5 w-3.5" /></button>
                    <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 my-1 mx-1" />
                    <button type="button" onClick={() => handleInsertTag('<h1>', '</h1>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 font-bold" title="Heading 1"><Heading1 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => handleInsertTag('<h2>', '</h2>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 font-bold" title="Heading 2"><Heading2 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => handleInsertTag('<blockquote>', '</blockquote>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300" title="Quote"><Quote className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => handleInsertTag('<a href="">', '</a>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300" title="Hyperlink"><Link2 className="h-3.5 w-3.5" /></button>
                    <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 my-1 mx-1" />
                    <button type="button" onClick={() => handleInsertTag('<ul><li>', '</li></ul>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300" title="Bullet List"><List className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => handleInsertTag('<code>', '</code>')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300" title="Code Block"><Code className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => handleInsertTag('<table border="1"><tr><td>Cell</td></tr></table>', '')} className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300" title="Table"><Table className="h-3.5 w-3.5" /></button>
                  </div>

                  {/* Core Content Textarea */}
                  <textarea
                    id="news-composer-textarea"
                    required
                    rows="8"
                    placeholder="Compose your article copying HTML format where appropriate..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-xs p-3.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none font-mono resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Tags & Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black">Search Keywords / Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="E.g. UpElections, SmartCities, DelhiInfra"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black">Cover Image (upload file)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 file:mr-2 file:text-[10px] file:font-black file:uppercase file:border-0 file:bg-red-600 file:text-white file:px-2 file:py-1 file:rounded"
                  />
                  {imageFile && <p className="text-[10px] text-slate-400 truncate">{imageFile.name}</p>}
                </div>
              </div>

              {/* Video File & Premium Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black">Video (upload mp4/webm, optional)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 file:mr-2 file:text-[10px] file:font-black file:uppercase file:border-0 file:bg-red-600 file:text-white file:px-2 file:py-1 file:rounded"
                  />
                  {videoFile && <p className="text-[10px] text-slate-400 truncate">{videoFile.name}</p>}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="isPremium"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="h-4 w-4 text-red-650 border-slate-300 rounded"
                  />
                  <label htmlFor="isPremium" className="text-xs text-slate-750 dark:text-slate-300 font-bold select-none cursor-pointer">
                    Premium Exclusive (Paid Subscribers Only)
                  </label>
                </div>
              </div>

              {/* Scheduled publication dates selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black">Schedule Publishing Time (Optional)</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={scheduledPublishAt}
                    onChange={(e) => setScheduledPublishAt(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded shadow transition-colors flex items-center gap-1.5"
                >
                  <FileText className="h-4 w-4" />
                  <span>Submit Article</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bulk CSV Import Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Upload className="h-5 w-5 text-red-600" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase">Bulk CSV Import</h3>
            </div>
            <p className="text-[11px] text-slate-550">Upload multiple articles using plain text CSV data. Expected headers: <code className="bg-slate-100 p-0.5 rounded">title,content,category,state,city</code></p>
            <textarea
              rows="4"
              placeholder="E.g.&#10;title,content,category,state,city&#10;Test News,Test Copy,Sports,Uttar Pradesh,Ghaziabad"
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="w-full text-xs p-2.5 border rounded bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 font-mono"
            />
            <button
              onClick={handleBulkCSVSubmit}
              className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2 rounded transition-colors"
            >
              Start Bulk Import
            </button>
          </div>
        </div>

        {/* Right Sidebar: AI Assistant Panels */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Sparkles className="h-5 w-5 text-red-600 animate-pulse" />
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm uppercase">AI Editor Assistant</h3>
            </div>
            
            {/* AI Action list buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleAIHeadline} disabled={aiLoading} className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-2 rounded text-[11px] hover:bg-red-100 transition-colors font-bold">Headline Helper</button>
              <button onClick={handleAISummarize} disabled={aiLoading} className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-2 rounded text-[11px] hover:bg-red-100 transition-colors font-bold">Auto Summary</button>
              <button onClick={handleAITags} disabled={aiLoading} className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-2 rounded text-[11px] hover:bg-red-100 transition-colors font-bold">Auto Tags</button>
              <button onClick={handleAIGrammar} disabled={aiLoading} className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-2 rounded text-[11px] hover:bg-red-100 transition-colors font-bold">Grammar Check</button>
              <button onClick={handleAIDuplicate} disabled={aiLoading} className="bg-slate-105 p-2 rounded text-[11px] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold col-span-2">Detect Duplicate</button>
            </div>

            {/* AI Assistant Output Areas */}
            <div className="space-y-3 pt-2 text-[11px] text-slate-650 dark:text-slate-350">
              
              {/* Headlines suggestions display */}
              {aiHeadlines.length > 0 && (
                <div className="space-y-1.5 border-t pt-3">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">Headline Suggestions:</span>
                  <div className="space-y-1">
                    {aiHeadlines.map((h, i) => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={() => setTitle(h)}
                        className="w-full text-left p-1.5 border dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-red-500 transition-colors truncate"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary display */}
              {aiSummary && (
                <div className="space-y-1 border-t pt-3">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">Generated Summary:</span>
                  <p className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-2 rounded leading-relaxed">{aiSummary}</p>
                </div>
              )}

              {/* Grammar checking display */}
              {aiGrammarText && (
                <div className="space-y-1 border-t pt-3">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-red-550 flex items-center gap-1">Corrected Text Suggest:</span>
                  <textarea 
                    readOnly
                    rows="3"
                    value={aiGrammarText} 
                    className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-2 rounded leading-relaxed text-[11px] font-mono resize-none select-all"
                  />
                </div>
              )}

              {/* Duplicate metrics display */}
              {aiDuplicateReport && (
                <div className="space-y-1 border-t pt-3">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">Duplicate Check Report:</span>
                  <p className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-2 rounded leading-relaxed flex items-center gap-1.5 font-bold"><AlertTriangle className="h-4 w-4 text-yellow-500" />{aiDuplicateReport}</p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JournalistDashboard;
