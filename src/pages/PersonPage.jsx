import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import MovieCard from '../components/common/MovieCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

const PersonPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useDocumentTitle(person ? `${person.name} - MoiMovies` : 'Loading... | MoiMovies');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const detail = await tmdbApi.getPersonDetail(id);
        const creditsData = await tmdbApi.getPersonCredits(id);
        
        setPerson(detail);
        
        const sortedCredits = creditsData.cast
            .filter(c => c.poster_path)
            .sort((a, b) => b.popularity - a.popularity);
            
        setCredits(sortedCredits);
      } catch (error) {
        console.error("Error fetching person:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-white text-center pt-32 text-xl">Loading info...</div>;
  if (!person) return <div className="text-white text-center pt-32 text-xl">Person not found</div>;

  return (
    <div className="text-white bg-gray-900 min-h-screen pt-24 px-4 md:px-8 pb-10">
      <div className="max-w-screen-xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-10">
          {/* ẢNH & INFO */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-center md:items-start">
            <div className="w-64 rounded-xl overflow-hidden shadow-2xl border border-gray-800 mb-6">
              <img 
                src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/300x450'} 
                alt={person.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thông tin cá nhân */}
            <div className="space-y-4 w-full">
                <h3 className="text-xl font-bold border-b border-gray-700 pb-2 mb-2">Personal Info</h3>
                
                <div>
                    <strong className="block text-gray-400 text-sm">Known For</strong>
                    <span>{person.known_for_department}</span>
                </div>
                <div>
                    <strong className="block text-gray-400 text-sm">Gender</strong>
                    <span>{person.gender === 1 ? 'Female' : 'Male'}</span>
                </div>
                <div>
                    <strong className="block text-gray-400 text-sm">Birthday</strong>
                    <span>{person.birthday || 'N/A'}</span>
                </div>
                <div>
                    <strong className="block text-gray-400 text-sm">Place of Birth</strong>
                    <span>{person.place_of_birth || 'N/A'}</span>
                </div>
            </div>
          </div>

          {/* TIỂU SỬ & DANH SÁCH PHIM */}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-6">{person.name}</h1>
            
            <div className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">Biography</h3>
                <p className="text-gray-300 leading-relaxed text-base">
                    {person.biography || "We don't have a biography for this person."}
                </p>
            </div>

            <div>
                <h3 className="text-2xl font-semibold mb-6 border-l-4 border-red-600 pl-3">Known For</h3>
                
                {/* Danh sách phim*/}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {credits.map((item) => (
                        <MovieCard
                            key={item.id + item.media_type}
                            movie={item.media_type === 'movie' ? item.title : null}
                            tv={item.media_type === 'tv' ? item.name : null}
                            img={item.poster_path}
                            id={item.id}
                        />
                    ))}
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PersonPage;