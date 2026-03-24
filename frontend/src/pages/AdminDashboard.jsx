import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cropper from 'react-easy-crop';
import { 
  LayoutDashboard, ShoppingBag, Utensils, Users, 
  Settings, BarChart3, Clock, Plus, Edit, Trash2, X, Save, Scissors, 
  Image as ImageIcon, ZoomIn, ZoomOut, Maximize, RectangleHorizontal, RectangleVertical,
  User, MapPin, CreditCard, ShoppingCart
} from 'lucide-react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const AdminDashboard = () => {
  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();

  if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'manager')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You do not have permission to view this page.</p>
        <Link to="/login" className="btn-primary">Login as Admin</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-left">
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8 hidden lg:block">
        <h2 className="text-xl font-bold text-primary">Royal Palace</h2>
        <nav className="space-y-4">
          <Link to="/admin" className="flex items-center space-x-3 text-gray-700 hover:text-primary"><LayoutDashboard size={20}/> <span>Overview</span></Link>
          <Link to="/admin/orders" className="flex items-center space-x-3 text-gray-700 hover:text-primary"><ShoppingBag size={20}/> <span>Orders</span></Link>
          <Link to="/admin/menu" className="flex items-center space-x-3 text-gray-700 hover:text-primary"><Utensils size={20}/> <span>Menu</span></Link>
          <Link to="/admin/reservations" className="flex items-center space-x-3 text-gray-700 hover:text-primary"><Clock size={20}/> <span>Reservations</span></Link>
        </nav>
      </aside>

      <main className="flex-grow p-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="reservations" element={<ReservationList />} />
        </Routes>
      </main>
    </div>
  );
};

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchReservations = async () => {
      const { data } = await axios.get('/api/reservations', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setReservations(data);
    };
    fetchReservations();
  }, [userInfo]);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/reservations/${id}`, { status }, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    setReservations(reservations.map(r => r._id === id ? { ...r, status } : r));
  };

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden text-left">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
          <tr>
            <th className="p-4">Guest</th>
            <th className="p-4">Date & Time</th>
            <th className="p-4">Party Size</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reservations.map(res => (
            <tr key={res._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <button 
                  onClick={() => setSelectedRes(res)} 
                  className="font-bold text-primary hover:underline text-sm"
                >
                  {res.name}
                </button>
              </td>
              <td className="p-4 text-sm font-medium text-gray-700">
                {new Date(res.date).toLocaleDateString()} at {formatTime(res.time)}
              </td>
              <td className="p-4 text-sm text-gray-600">
                {res.partySize} People
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                  res.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {res.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <select 
                  onChange={(e) => updateStatus(res._id, e.target.value)}
                  className="bg-gray-100 border-none rounded p-1 text-[10px] focus:ring-0"
                  value={res.status}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-left">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Reservation Details</h3>
              <button onClick={() => setSelectedRes(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-gray-400 uppercase font-bold">Guest</p><p className="font-semibold">{selectedRes.name}</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase font-bold">Phone</p><p className="font-semibold">{selectedRes.phone}</p></div>
                <div className="col-span-2"><p className="text-[10px] text-gray-400 uppercase font-bold">Email</p><p className="font-semibold">{selectedRes.email}</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase font-bold">Date</p><p className="font-semibold">{new Date(selectedRes.date).toLocaleDateString()}</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase font-bold">Time</p><p className="font-semibold">{formatTime(selectedRes.time)}</p></div>
              </div>
              <button onClick={() => setSelectedRes(null)} className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuManager = () => {
  const [menu, setMenu] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(4/3); 
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [formData, setFormData] = useState({
    name: '', price: '', category: 'mains', image: '', stock: 0, description: ''
  });
  const { userInfo } = useSelector(state => state.auth);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) => new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
    });
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropSave = async () => {
    try {
      setUploading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImageBlob], 'cropped-item.jpg', { type: 'image/jpeg' });
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      const { data } = await axios.post('/api/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` }
      });
      setFormData({ ...formData, image: data.url });
      setShowCropper(false);
      setImageSrc(null);
      setUploading(false);
    } catch (e) {
      const serverError = e.response?.data?.message || e.message;
      alert('Upload Failed: ' + serverError + '\n\nPlease update your Cloudinary keys in backend/.env');
      setUploading(false);
    }
  };

  const fetchMenu = async () => {
    const { data } = await axios.get('/api/menu');
    setMenu(data);
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, price: item.price, category: item.category, image: item.image, stock: item.stock, description: item.description || '' });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ name: '', price: '', category: 'mains', image: '', stock: 0, description: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Please upload or enter an image URL");
    try {
      if (editingItem) {
        await axios.put(`/api/menu/${editingItem._id}`, formData, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      } else {
        await axios.post('/api/menu', formData, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      }
      setIsModalOpen(false);
      fetchMenu();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving");
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Delete this item?')) {
      await axios.delete(`/api/menu/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      fetchMenu();
    }
  };

  const deleteAllItems = async () => {
    if (window.confirm('WARNING: Are you sure you want to delete ALL menu items? This cannot be undone.')) {
      try {
        await axios.delete('/api/menu', { headers: { Authorization: `Bearer ${userInfo.token}` } });
        fetchMenu();
        alert('All items deleted successfully');
      } catch (error) {
        alert('Failed to delete all items');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden relative text-left">
      {showCropper && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
          <div className="relative w-full h-[60vh] bg-gray-800 rounded-lg overflow-hidden">
            <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
          </div>
          <div className="mt-6 w-full max-w-md space-y-6 text-center">
            <div className="flex justify-center space-x-4 bg-gray-800 p-2 rounded-xl border border-gray-700">
              <button onClick={() => setAspect(4/3)} className={`p-2 rounded-lg transition ${aspect === 4/3 ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}><RectangleHorizontal size={20}/></button>
              <button onClick={() => setAspect(1)} className={`p-2 rounded-lg transition ${aspect === 1 ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}><Maximize size={20}/></button>
              <button onClick={() => setAspect(3/4)} className={`p-2 rounded-lg transition ${aspect === 3/4 ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}><RectangleVertical size={20}/></button>
            </div>
            <div className="flex items-center space-x-4 bg-gray-800 p-3 rounded-xl border border-gray-700">
              <button onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="text-white hover:text-primary transition"><ZoomOut size={24}/></button>
              <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(parseFloat(e.target.value))} className="flex-grow accent-primary" />
              <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="text-white hover:text-primary transition"><ZoomIn size={24}/></button>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => { setShowCropper(false); setImageSrc(null); }} className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold transition hover:bg-gray-600">Cancel</button>
              <button onClick={handleCropSave} disabled={uploading} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition hover:bg-red-600">
                {uploading ? <span className="animate-pulse">Uploading...</span> : <><Scissors size={20} /><span>Crop & Save</span></>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-lg">Menu Management</h3>
        <div className="flex space-x-2">
          <button onClick={deleteAllItems} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm flex items-center space-x-2 transition"><Trash2 size={16} /><span>Delete All</span></button>
          <button onClick={handleAddNew} className="btn-primary text-sm px-4 py-2 flex items-center space-x-2 transition"><Plus size={16} /><span>Add Item</span></button>
        </div>
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] font-bold">
          <tr><th className="p-4">Dish Details</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4 text-right">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {menu.map(item => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 flex items-center space-x-3">
                <img src={item.image} className="w-10 h-10 rounded shadow-sm object-cover" alt="" />
                <div><p className="font-bold text-sm text-gray-800">{item.name}</p><p className="text-[10px] text-gray-400 capitalize">{item.category}</p></div>
              </td>
              <td className="p-4 font-bold text-sm text-primary">₹{item.price}</td>
              <td className="p-4 text-xs">{item.stock} in stock</td>
              <td className="p-4 text-right">
                <div className="flex justify-end space-x-1">
                  <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                  <button onClick={() => deleteItem(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden text-left">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit' : 'Add New'} Menu Item</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><label className="text-sm font-medium text-gray-700">Item Name</label><input type="text" required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-sm font-medium text-gray-700">Price</label><input type="number" required className="w-full border rounded-lg px-4 py-2" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700">Stock</label><input type="number" required className="w-full border rounded-lg px-4 py-2" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700">Category</label><select className="w-full border rounded-lg px-4 py-2 capitalize" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>{['starters', 'mains', 'desserts', 'drinks', 'sides'].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                </div>
                <div><label className="text-sm font-medium text-gray-700">Description</label><textarea className="w-full border rounded-lg px-4 py-2" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea></div>
                <div><label className="text-[10px] text-gray-400 font-bold uppercase">Image URL (Upload or Paste)</label><input type="text" className="w-full border rounded-lg px-4 py-2 text-xs focus:ring-2 focus:ring-primary outline-none transition" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://image-link.com" /></div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Dish Image Preview</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center h-[220px] flex flex-col justify-center relative overflow-hidden group bg-gray-50">
                  {formData.image ? (
                    <div className="absolute inset-0">
                      <img src={formData.image} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <label className="cursor-pointer bg-white px-4 py-2 rounded-lg font-bold text-sm flex items-center space-x-2 shadow-lg"><ImageIcon size={16} /><span>Change</span><input type="file" accept="image/*" onChange={onFileChange} className="hidden" /></label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm"><Plus size={24} /></div>
                      <p className="text-gray-600 font-medium text-xs mt-2 uppercase tracking-tighter">JPG, PNG, JPEG, WEBP</p>
                      <label className="mt-4 cursor-pointer btn-primary py-2 px-6 rounded-lg text-xs inline-block shadow-md">Choose File<input type="file" accept="image/*" onChange={onFileChange} className="hidden" /></label>
                    </>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 border-t pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-2 border rounded-xl font-bold transition hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-10 py-2 btn-primary font-bold shadow-lg flex items-center space-x-2 transition hover:scale-105"><Save size={18} /><span>{editingItem ? 'Update' : 'Create'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Overview = () => {
  const [stats, setStats] = useState(null);
  const { userInfo } = useSelector(state => state.auth);
  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get('/api/analytics/dashboard', { headers: { Authorization: `Bearer ${userInfo.token}` } });
      setStats(data);
    };
    fetchStats();
  }, [userInfo]);
  if (!stats) return <div className="text-left py-20">Loading Analytics...</div>;
  return (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary"><p className="text-gray-500 text-xs uppercase font-bold">Revenue</p><h3 className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</h3></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500"><p className="text-gray-500 text-xs uppercase font-bold">Orders</p><h3 className="text-2xl font-bold">{stats.totalOrders}</h3></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500"><p className="text-gray-500 text-xs uppercase font-bold">Customers</p><h3 className="text-2xl font-bold">{stats.totalUsers}</h3></div>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold mb-6">Sales Trends</h3>
        <div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={stats.salesData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" /><YAxis /><Tooltip /><Line type="monotone" dataKey="totalSales" stroke="#ff4d4d" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
      </div>
    </div>
  );
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${userInfo.token}` } });
      setOrders(data);
    };
    fetchOrders();
  }, [userInfo]);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${userInfo.token}` } });
    setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: status } : o));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden text-left">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
          <tr>
            <th className="p-4">Customer</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map(order => (
            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="font-bold text-primary hover:underline text-sm"
                >
                  {order.user?.name || 'Guest User'}
                </button>
              </td>
              <td className="p-4 font-bold text-sm">₹{order.totalPrice.toFixed(2)}</td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.orderStatus}</span></td>
              <td className="p-4 text-right">
                <select onChange={(e) => updateStatus(order._id, e.target.value)} className="bg-gray-100 border-none rounded p-1 text-[10px]" value={order.orderStatus}>
                  {['Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden text-left">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-bold text-sm text-gray-500 uppercase tracking-wider"><User size={16}/> Customer Info</h4>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-1 border border-gray-100">
                    <p className="font-bold text-lg">{selectedOrder.user?.name || 'Guest'}</p>
                    <p className="text-gray-600 text-sm">{selectedOrder.user?.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-bold text-sm text-gray-500 uppercase tracking-wider"><MapPin size={16}/> Shipping Address</h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed">
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-bold text-sm text-gray-500 uppercase tracking-wider"><ShoppingCart size={16}/> Items Ordered</h4>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 font-bold border-b">
                      <tr><th className="p-3 text-left">Item</th><th className="p-3 text-center">Qty</th><th className="p-3 text-right">Price</th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.orderItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 flex items-center gap-3">
                            <img src={item.image} className="w-10 h-10 rounded object-cover" alt=""/>
                            <span className="font-medium">{item.name}</span>
                          </td>
                          <td className="p-3 text-center">{item.qty}</td>
                          <td className="p-3 text-right font-bold">₹{(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold border-t">
                      <tr><td colSpan="2" className="p-3 text-right">Grand Total:</td><td className="p-3 text-right text-primary text-lg">₹{selectedOrder.totalPrice.toFixed(2)}</td></tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-bold text-sm text-gray-500 uppercase tracking-wider"><CreditCard size={16}/> Payment Status</h4>
                <div className={`p-4 rounded-xl flex justify-between items-center ${selectedOrder.isPaid ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  <p className="font-bold">{selectedOrder.isPaid ? 'PAID via ' + selectedOrder.paymentMethod : 'NOT PAID'}</p>
                  {selectedOrder.isPaid && <p className="text-xs">{new Date(selectedOrder.paidAt).toLocaleString()}</p>}
                </div>
              </div>

              <button onClick={() => setSelectedOrder(null)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Close Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;