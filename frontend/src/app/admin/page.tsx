'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDataStore, Doctor, Scheme, Video } from '@/store/dataStore';
import { useState, useEffect } from 'react';
import { Bell, UserPlus, Save, Edit, FilePlus, Lock, LogOut } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { useUIStore } from '@/store/uiStore';
import { AdminNavbar } from '@/components/layout/AdminNavbar';

export default function AdminPage() {
  const { doctors, addDoctor, updateDoctor, fetchDoctors, schemes, addScheme, updateScheme, fetchSchemes, addNotification, videos, fetchVideos, addVideo, updateVideo } = useDataStore();
  const { setUser } = useUIStore();

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<Partial<Doctor>>({});

  const [editingSchemeId, setEditingSchemeId] = useState<string | number | null>(null);
  const [schemeFormData, setSchemeFormData] = useState<Partial<Scheme>>({});

  const [editingVideoId, setEditingVideoId] = useState<string | number | null>(null);
  const [videoFormData, setVideoFormData] = useState<Partial<Video>>({});

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setMounted(true);
    // Check token on every mount/refresh — this keeps admin logged in across page reloads
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    fetchVideos();
    fetchDoctors();
    fetchSchemes();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const data = await AuthService.login(email, password);
      localStorage.setItem('admin_token', data.accessToken);
      localStorage.removeItem('sakhi_user');
      setUser(null);
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    // Clear token from storage, update state, then redirect to admin login
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const handleEdit = (doc: Doctor) => {
    setEditingId(doc.id || null);
    setFormData(doc);
  };

  const handleSave = () => {
    if (editingId) {
      // Strip MongoDB metadata fields that cause 400 errors on update
      const { _id, id, __v, createdAt, updatedAt, ...cleanData } = formData as any;
      updateDoctor(editingId, cleanData);
    } else {
      addDoctor(formData as Omit<Doctor, 'id'>);
    }
    setEditingId(null);
    setFormData({});
  };

  const handleAddNew = () => {
    setEditingId(-1); // -1 means new
    setFormData({
      name: "",
      specialty: "",
      experience: "",
      rating: 5.0,
      reviews: 0,
      location: "",
      distance: "",
      consultationFee: "₹",
      languages: ["English"],
      isOnline: true
    });
  };

  const handleSchemeEdit = (sch: Scheme) => {
    setEditingSchemeId(sch.id || null);
    setSchemeFormData(sch);
  };

  const handleSchemeSave = () => {
    if (editingSchemeId) {
      // Strip MongoDB metadata fields that cause 400 errors on update
      const { _id, id, __v, createdAt, updatedAt, ...cleanData } = schemeFormData as any;
      updateScheme(editingSchemeId, cleanData);
    } else {
      addScheme(schemeFormData as Omit<Scheme, 'id'>);
    }
    setEditingSchemeId(null);
    setSchemeFormData({});
  };

  const handleAddNewScheme = () => {
    setEditingSchemeId(-1);
    setSchemeFormData({
      title: "",
      category: "",
      description: "",
      eligibility: "",
      iconName: "Landmark",
      link: "",
      imageUrl: ""
    });
  };

  const handleVideoEdit = (vid: Video) => {
    setEditingVideoId(vid.id || vid._id || null);
    setVideoFormData(vid);
  };

  const handleVideoSave = () => {
    if (editingVideoId && editingVideoId !== -1) {
      // Strip MongoDB metadata fields that cause 400 errors on update
      const { _id, id, __v, createdAt, updatedAt, ...cleanData } = videoFormData as any;
      updateVideo(editingVideoId, cleanData);
    } else {
      addVideo(videoFormData as Omit<Video, 'id' | '_id'>);
    }
    setEditingVideoId(null);
    setVideoFormData({});
  };

  const handleAddNewVideo = () => {
    setEditingVideoId(-1);
    setVideoFormData({
      title: "",
      description: "",
      duration: "0:00",
      tags: [],
      image: "",
      youtubeId: ""
    });
  };

  const sendCycleNotification = () => {
    addNotification({
      message: "Your next menstrual cycle is predicted to start in 3 days. Please stay prepared and log any pre-symptoms in your Smart Tracker.",
      type: "info"
    });
    alert("Cycle notification sent to all active users!");
  };

  // Prevent SSR hydration mismatch — only render auth-gated content on client
  if (!mounted) return null;

  // ── Admin Login Screen (standalone, no layout chrome)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-950 to-slate-900 flex flex-col items-center justify-center p-4">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src="/logo.jpg" alt="SAKHI" className="h-16 w-auto rounded-xl shadow-2xl" />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">SAKHI Admin</h1>
            <p className="text-pink-300 text-sm mt-1">Secure Administrator Portal</p>
          </div>
        </div>
        <div className="w-full max-w-sm">
          <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto bg-pink-500/20 w-12 h-12 flex items-center justify-center rounded-full mb-2">
                <Lock className="h-6 w-6 text-pink-300" />
              </div>
              <CardTitle className="text-xl text-white">Admin Login</CardTitle>
              <p className="text-sm text-pink-200/70">Enter your credentials to access the dashboard.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-pink-200/50 focus:border-pink-400"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-pink-200/50 focus:border-pink-400"
                />
                {authError && <p className="text-sm text-red-400">{authError}</p>}
                <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border-0 shadow-lg">
                  Login to Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard (with dedicated AdminNavbar)
  return (
    <div className="min-h-screen bg-muted/20">
      <AdminNavbar onLogout={handleLogout} />

      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* ── Dashboard Content ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-muted-foreground mt-1">Manage platform data and send push notifications.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Card className="col-span-1 border-emerald-200">
            <CardHeader className="bg-emerald-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Healthcare Directory</CardTitle>
              <Button onClick={handleAddNew} size="sm" variant="outline" className="border-emerald-500 text-emerald-700">
                <UserPlus className="h-4 w-4 mr-2" /> Add Doctor
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {editingId !== null && (
                <div className="bg-muted/30 p-4 rounded-lg space-y-4 border">
                  <h3 className="font-semibold">{editingId === -1 ? "Add New Doctor" : "Edit Doctor"}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Name *"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      placeholder="Specialty * (e.g. Gynecologist)"
                      value={formData.specialty || ''}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    />
                    <Input
                      placeholder="Experience * (e.g. 8 Years)"
                      value={formData.experience || ''}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                    <Input
                      placeholder="Location * (e.g. Chennai)"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <Input
                      placeholder="Fee * (e.g. ₹800)"
                      value={formData.consultationFee || ''}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    />
                    <Input
                      placeholder="Distance (e.g. 2.5 km)"
                      value={formData.distance || ''}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {doctors.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.specialty} • {doc.location}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(doc)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gov Schemes Manager */}
          <Card className="col-span-1 md:col-span-3 border-orange-200">
            <CardHeader className="bg-orange-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Gov Schemes Manager</CardTitle>
              <Button onClick={handleAddNewScheme} size="sm" variant="outline" className="border-orange-500 text-orange-700">
                <FilePlus className="h-4 w-4 mr-2" /> Add Scheme
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {editingSchemeId !== null && (
                <div className="bg-muted/30 p-4 rounded-lg space-y-4 border">
                  <h3 className="font-semibold">{editingSchemeId === -1 ? "Add New Scheme" : "Edit Scheme"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Title"
                      value={schemeFormData.title || ''}
                      onChange={(e) => setSchemeFormData({ ...schemeFormData, title: e.target.value })}
                    />
                    <Input
                      placeholder="Category"
                      value={schemeFormData.category || ''}
                      onChange={(e) => setSchemeFormData({ ...schemeFormData, category: e.target.value })}
                    />
                    <Input
                      placeholder="Link URL"
                      value={schemeFormData.link || ''}
                      onChange={(e) => setSchemeFormData({ ...schemeFormData, link: e.target.value })}
                    />
                    <Input
                      placeholder="Banner Image URL"
                      value={schemeFormData.imageUrl || ''}
                      onChange={(e) => setSchemeFormData({ ...schemeFormData, imageUrl: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description"
                      className="md:col-span-2 min-h-[100px]"
                      value={schemeFormData.description || ''}
                      onChange={(e) => setSchemeFormData({ ...schemeFormData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSchemeSave} className="bg-orange-600 hover:bg-orange-700">
                      <Save className="h-4 w-4 mr-2" /> Save Scheme
                    </Button>
                    <Button variant="outline" onClick={() => setEditingSchemeId(null)}>Cancel</Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {schemes.map(sch => (
                  <div key={sch.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{sch.title}</p>
                      <p className="text-xs text-muted-foreground">{sch.category}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleSchemeEdit(sch)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Awareness Videos Manager */}
          <Card className="col-span-1 md:col-span-3 border-pink-200">
            <CardHeader className="bg-pink-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Awareness Videos Manager</CardTitle>
              <Button onClick={handleAddNewVideo} size="sm" variant="outline" className="border-pink-500 text-pink-700">
                <FilePlus className="h-4 w-4 mr-2" /> Add Video
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {editingVideoId !== null && (
                <div className="bg-muted/30 p-4 rounded-lg space-y-4 border">
                  <h3 className="font-semibold">{editingVideoId === -1 ? "Add New Video" : "Edit Video"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Video Title"
                      value={videoFormData.title || ''}
                      onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                    />
                    <Input
                      placeholder="YouTube ID (e.g., vOZTvQ40O0w)"
                      value={videoFormData.youtubeId || ''}
                      onChange={(e) => setVideoFormData({ ...videoFormData, youtubeId: e.target.value })}
                    />

                    <Input
                      placeholder="Image URL"
                      value={videoFormData.image || ''}
                      onChange={(e) => setVideoFormData({ ...videoFormData, image: e.target.value })}
                    />
                    <Input
                      placeholder="Tags (comma separated)"
                      value={videoFormData.tags?.join(', ') || ''}
                      onChange={(e) => setVideoFormData({ ...videoFormData, tags: e.target.value.split(',').map(t => t.trim()) })}
                    />
                    <Textarea
                      placeholder="Description"
                      className="md:col-span-2 min-h-[120px]"
                      value={videoFormData.description || ''}
                      onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleVideoSave} className="bg-pink-600 hover:bg-pink-700">
                      <Save className="h-4 w-4 mr-2" /> Save Video
                    </Button>
                    <Button variant="outline" onClick={() => setEditingVideoId(null)}>Cancel</Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {videos.map(vid => (
                  <div key={vid.id || vid._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      {vid.image && <img src={vid.image} alt="thumbnail" className="w-12 h-8 object-cover rounded" />}
                      <div>
                        <p className="font-medium">{vid.title}</p>

                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleVideoEdit(vid)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
