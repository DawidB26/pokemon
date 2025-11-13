import { useEffect, useState } from 'react';
import 'App.css';

function App() {
  const API = "https://pokeapi.co/api/v2/pokemon";
  const [listPokemons, setListPokemons] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  async function fetchListOfPokemons() {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}?limit=20`);
      const data = await res.json();
      setListPokemons(data.results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPokemonDetails(urlOrName) {
    setIsLoading(true);
    try {
      const res = await fetch(urlOrName);
      const data = await res.json();
      setPokemonDetails(data);
    } catch (e) {
      console.error(e);
      setPokemonDetails(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPokemonDetailsFromInput() {
    if (!input) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/${input.toLowerCase()}`);
      const data = await res.json();
      setPokemonDetails(data);
    } catch (e) {
      console.error(e);
      setPokemonDetails(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchListOfPokemons();
  }, []);

  return (
    <div className="container">
      <h1>GameDex</h1>

      <div className="search-box">
        <input 
          type="text" 
          placeholder="Wpisz nazwę Pokemona" 
          onChange={(e) => setInput(e.target.value)} 
        />
        <button onClick={fetchPokemonDetailsFromInput}>Szukaj</button>
      </div>

      {/* Loading GIF */}
      {isLoading && (
        <div className="loading">
          <img 
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjRqejU3YXd5M2xyNzE3bDA2a3RpZGo2ZHpxYWRjbXV4bG1tZ2ZkMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0U7bWQK9s75PjRKcHz/giphy.gif" 
            alt="Loading..." 
            width={80}
          />
        </div>
      )}

      <div className="list">
        {listPokemons.map((pokemon, index) => (
          <div 
            key={pokemon.name} 
            className={`item type-${pokemon.name}`} 
            onClick={() => fetchPokemonDetails(pokemon.url)}
          >
            <p>#{index + 1} {pokemon.name}</p>
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`} 
              alt={pokemon.name} 
            />
          </div>
        ))}
      </div>

      {pokemonDetails && (
        <div className="details">
          <h2>{pokemonDetails.name}</h2>
          <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
          <p>
            <strong>Typy:</strong>{' '}
            {pokemonDetails.types.map(t => (
              <span key={t.type.name} className={`type type-${t.type.name}`}>
                {t.type.name}
              </span>
            ))}
          </p>
          <p><strong>Wzrost:</strong> {pokemonDetails.height}</p>
          <p><strong>Waga:</strong> {pokemonDetails.weight}</p>
          <p><strong>Statystyki:</strong></p>
          <ul>
            {pokemonDetails.stats.map(s => (
              <li key={s.stat.name}>{s.stat.name}: {s.base_stat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
