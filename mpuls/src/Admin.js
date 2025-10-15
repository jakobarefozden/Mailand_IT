import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import ArticleList from './ArticleList';
import ArticleForm from './ArticleForm';
import EditArticleForm from './EditArticleForm';

function Admin() {
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [userRole, setUserRole] = useState('student');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || 'student');
        } else {
          setUserRole('student');
          await setDoc(doc(db, 'users', currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            role: 'student',
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('student');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    const unsubscribe = onSnapshot(collection(db, 'articles'), (snapshot) => {
      let articlesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched articles:', articlesList); // 
      if (userRole === 'student' && currentUser.email) {
        articlesList = articlesList.filter(article => article.author === currentUser.email);
        console.log('Filtered articles for student:', articlesList); // 
      }
      setArticles(articlesList);
    });

    return () => unsubscribe();
  }, [currentUser, navigate, userRole]);

  if (loading) {
    return <div>Laster...</div>;
  }

  if (!currentUser) {
    return null;
  }

  const filteredArticles = articles.filter(article => {
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEdit = (article) => {
    if (userRole === 'student' && article.author !== currentUser.email) {
      alert('Du kan bare redigere dine egne artikler.');
      return;
    }
    setEditArticle(article);
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    const article = articles.find(a => a.id === id);
    if (userRole === 'student' && article.author !== currentUser.email) {
      alert('Du kan bare slette dine egne artikler.');
      return;
    }
    if (window.confirm('Er du sikker på at du vil slette denne artikkelen?')) {
      try {
        await deleteDoc(doc(db, 'articles', id));
        console.log('Article deleted successfully');
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handleCloseEdit = () => {
    setShowEditForm(false);
    setEditArticle(null);
  };

  const handleCloseAdd = () => {
    setShowAddForm(false);
  };

  const handleLogout = async () => {
    try {
      await signout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <main className="pt-20 pb-20 mt-16 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <div className="flex items-center justify-between mb-4">
          <p>Velkommen, {currentUser.email}! Rol: {userRole}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logg ut
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Legg til ny artikkel
        </button>

        <div className="mb-4 space-y-2">
          <div>
            <label className="block">Filtrer etter kategori</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="all">Alle</option>
              <option value="nyheter">Nyheter</option>
              <option value="intervjuer">Intervjuer</option>
              <option value="diskusjoner">Diskusjoner</option>
            </select>
          </div>
          <div>
            <label className="block">Søk i tittel eller innhold</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Søk..."
            />
          </div>
        </div>

        <ArticleList articles={filteredArticles} onEdit={handleEdit} onDelete={handleDelete} />

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
              <h3 className="text-xl font-bold mb-4">Legg til ny artikkel</h3>
              <ArticleForm onClose={handleCloseAdd} />
            </div>
          </div>
        )}

        {showEditForm && editArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
              <h3 className="text-xl font-bold mb-4">Rediger artikkel</h3>
              <EditArticleForm article={editArticle} onClose={handleCloseEdit} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Admin;