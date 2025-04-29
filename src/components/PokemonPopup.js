import React from 'react';

const PokemonPopup = ({ pokemon, onClose }) => {
  const primaryType = pokemon.types[0].type.name; // Use the first type for the background

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className={`popup-content type-${primaryType}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{pokemon.name}</h2>
        <img
          className="popup-image"
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
        />
        <p>Type: {pokemon.types.map((typeInfo) => typeInfo.type.name).join(', ')}</p>
      </div>
    </div>
  );
};

export default PokemonPopup;
