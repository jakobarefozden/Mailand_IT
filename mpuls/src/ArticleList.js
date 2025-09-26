import React from 'react';
import { Link } from 'react-router-dom';

function ArticleList({ articles, onEdit, onDelete }) {
  return (
    <ul className="space-y-4">
      {articles.map((article) => {
        const firstTwoSentences = article.content.split('. ').slice(0, 2).join('. ') + '.';
        const createdAtDate = article.createdAt?.toDate ? article.createdAt.toDate() : new Date(article.createdAt);
        return (
          <li key={article.id} className="flex items-start border p-4 rounded shadow">
            <div className="mr-4">
              {article.imageUrl && <img src={process.env.PUBLIC_URL + article.imageUrl} alt={article.title} className="w-24 h-24 object-cover" />}
            </div>
            <div className="flex-1">
              <Link to={`/article/${article.id}`} className="text-blue-500 font-semibold hover:underline">
                {article.title}
              </Link>
              <p className="text-sm text-gray-600">{firstTwoSentences}</p>
              <p className="text-sm">Kategori: {article.category}</p>
              <p className="text-sm">Forfatter: {article.author}</p>
              <p className="text-sm">Dato: {createdAtDate.toLocaleDateString('nb-NO')}</p>
            </div>
            <div className="ml-4 space-x-2">
              <button
                onClick={() => onEdit(article)}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Rediger
              </button>
              <button
                onClick={() => onDelete(article.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Slett
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ArticleList;