import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, ShoppingBag, Utensils, Users, 
  Settings, BarChart3, Clock, Plus, Edit, Trash2, X, Save
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
        <p className="text-gray-600 mb-8">You do not have permission to view this page. Current Role: {userInfo?.role || 'Guest'}</p>
        <Link to="/login" className="btn-primary">Login as Admin</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-8 hidden lg:block">
        <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">Guest</th>
            <th className="p-4">Date & Time</th>
            <th className="p-4">Party Size</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res._id} className="border-t">
              <td className="p-4 font-bold">{res.name}</td>
              <td className="p-4">{new Date(res.date).toLocaleDateString()} at {formatTime(res.time)}</td>
              <td className="p-4">{res.partySize} People</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{res.status}</span>
              </td>
              <td className="p-4">
                <select 
                  onChange={(e) => updateStatus(res._id, e.target.value)}
                  className="bg-gray-100 border-none rounded p-1 text-sm"
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
    </div>
  );
};

const Overview = () => {
  const [stats, setStats] = useState(null);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get('/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setStats(data);
    };
    fetchStats();
  }, [userInfo]);

  if (!stats) return <div>Loading Analytics...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
          <p className="text-gray-500">Total Revenue</p>
          <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500">Total Orders</p>
          <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500">Customers</p>
          <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold mb-6">Sales Trends (Last 7 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalSales" stroke="#ff4d4d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setOrders(data);
    };
    fetchOrders();
  }, [userInfo]);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: status } : o));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">Order ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="border-t">
              <td className="p-4">{order._id.slice(-6)}</td>
              <td className="p-4">{order.user?.name}</td>
              <td className="p-4">₹{order.totalPrice.toFixed(2)}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.orderStatus}
                </span>
              </td>
              <td className="p-4">
                <select 
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="bg-gray-100 border-none rounded p-1 text-sm"
                  value={order.orderStatus}
                >
                  <option value="Received">Received</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MenuManager = () => {
  const [menu, setMenu] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'mains',
    image: '',
    stock: 0,
    description: ''
  });
  const { userInfo } = useSelector(state => state.auth);

  const fetchMenu = async () => {
    const { data } = await axios.get('/api/menu');
    setMenu(data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
      stock: item.stock,
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      category: 'mains',
      image: '',
      stock: 0,
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`/api/menu/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
      } else {
        await axios.post('/api/menu', formData, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
      }
      setIsModalOpen(false);
      fetchMenu();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving menu item");
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/menu/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        fetchMenu();
      } catch (error) {
        alert("Error deleting item");
      }
    }
  };

  const updatePriceInline = async (id, newPrice) => {
    try {
      await axios.put(`/api/menu/${id}`, { price: newPrice }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setMenu(menu.map(item => item._id === id ? { ...item, price: newPrice } : item));
    } catch (error) {
      console.error("Error updating price", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-lg">Menu Management</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsEditingMode(!isEditingMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEditingMode ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Edit size={16} />
            <span>{isEditingMode ? 'Finish Editing' : 'Edit Prices'}</span>
          </button>
          <button 
            onClick={handleAddNew}
            className="btn-primary text-sm px-4 py-2 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
          <tr>
            <th className="p-4">Dish Details</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {menu.map(item => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 flex items-center space-x-4">
                <img src={item.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt={item.name} />
                <div>
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                </div>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold capitalize">
                  {item.category}
                </span>
              </td>
              <td className="p-4">
                {isEditingMode ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">₹</span>
                    <input 
                      type="number" 
                      className="w-20 border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={item.price}
                      onChange={(e) => updatePriceInline(item._id, e.target.value)}
                    />
                  </div>
                ) : (
                  <span className="font-bold text-primary">₹{item.price}</span>
                )}
              </td>
              <td className="p-4">
                <span className={`text-sm ${item.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                  {item.stock} in stock
                </span>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Item"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => deleteItem(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input 
                  type="text" required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" required
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input 
                    type="number" required
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="starters">Starters</option>
                  <option value="mains">Mains</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks</option>
                  <option value="sides">Sides</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input 
                  type="text" required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4 flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary py-2 flex items-center justify-center space-x-2"
                >
                  <Save size={18} />
                  <span>{editingItem ? 'Update Item' : 'Create Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;