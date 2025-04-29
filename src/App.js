import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import PokemonList from './components/PokemonList';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import './App.css'; // Import the CSS file

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=150';

function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueTypes, setUniqueTypes] = useState([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch the list of 150 Pokemon (name and URL)
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const listData = await response.json();

        // 2. Fetch detailed data for each Pokemon
        const detailedPromises = listData.results.map(async (pokemon) => {
           const detailResponse = await fetch(pokemon.url);
           if (!detailResponse.ok) {
             // Log error for individual fetch but continue if possible
             console.error(`Failed to fetch details for ${pokemon.name}: ${detailResponse.status}`);
             return null; // Return null or a specific error object if needed
           }
           return await detailResponse.json();
        });

        const detailedResults = await Promise.all(detailedPromises);
        const validDetailedResults = detailedResults.filter(p => p !== null); // Filter out failed requests


        // 3. Extract unique types
        const typesSet = new Set();
        validDetailedResults.forEach(pokemon => {
          pokemon.types.forEach(typeInfo => typesSet.add(typeInfo.type.name));
        });
        setUniqueTypes(['all', ...Array.from(typesSet).sort()]); // Add 'all' and sort

        // 4. Set the state
        setAllPokemon(validDetailedResults);

      } catch (err) {
        console.error("Error fetching Pokemon data:", err);
        setError(err.message || 'Failed to fetch Pokémon data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, []); // Empty dependency array means this runs once on mount

  // Memoize the filtered list to avoid recalculating on every render
  const filteredPokemon = useMemo(() => {
    return allPokemon.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = selectedType === 'all' || pokemon.types.some(typeInfo => typeInfo.type.name === selectedType);
      return nameMatch && typeMatch;
    });
  }, [allPokemon, searchTerm, selectedType]);


  return (
    <div className="App">
      <Header />
      <div className="filters-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {uniqueTypes.length > 1 && ( // Only show filter if types are loaded
             <TypeFilter
               types={uniqueTypes.filter(t => t !== 'all')} // Don't show 'all' in options list
               selectedType={selectedType}
               setSelectedType={setSelectedType}
             />
           )}
      </div>

      <main>
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!isLoading && !error && <PokemonList pokemonList={filteredPokemon} />}
      </main>
    </div>
  );
}

export default App;