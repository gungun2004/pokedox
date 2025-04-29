import React from 'react';

const PokemonCard = ({ pokemon, index, onCardClick }) => {
  return (
    <div className="pokemon-card" onClick={onCardClick}>
      <img
        className="pokemon-image"
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
      />
      <span className="pokemon-index">#{index}</span>
      <h2 className="pokemon-name">{pokemon.name}</h2>
      <div className="pokemon-types">
        {pokemon.types.map((typeInfo) => (
          <span key={typeInfo.type.name} className={`pokemon-type ${typeInfo.type.name}`}>
            {typeInfo.type.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;