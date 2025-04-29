import React, { useState } from 'react';
import PokemonCard from './PokemonCard';
import PokemonPopup from './PokemonPopup';

const PokemonList = ({ pokemonList }) => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const closePopup = () => {
    setSelectedPokemon(null);
  };

  if (pokemonList.length === 0) {
    return <div className="empty-state">No Pokémon match your criteria.</div>;
  }

  return (
    <div className="pokemon-list">
      {pokemonList.map((pokemon, index) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          index={index + 1} // Pass 1-based index
          onCardClick={() => handleCardClick(pokemon)}
        />
      ))}
      {selectedPokemon && (
        <PokemonPopup pokemon={selectedPokemon} onClose={closePopup} />
      )}
    </div>
  );
};

export default PokemonList;