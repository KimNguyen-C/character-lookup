import {useParams, Link} from "react-router-dom";
import {useEffect, useState} from "react";



function Character() {

    const params = useParams();
    const [retry, setRetry] = useState(0);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            setError(null);
            setData(null);
            try {

                const response = await fetch(`https://rickandmortyapi.com/api/character/${params.id}`);

                if (!response.ok) {
                    throw new Error("Failed to load Character")
                }

                const json = await response.json();

                if (isMounted) {
                    setData({
                        name: json.name,
                        image: json.image,
                        gender: json.gender,
                        origin: json.origin.name,
                        location: json.location.name,
                        episodes: json.episode.length

                    });
                    setLoading(false);
                }

            } catch (err) {
                if (isMounted) {
                    setError(err.message)
                    setLoading(false);
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false;
        }


    }, [params.id, retry])

    return (
        <div className="detail-container">
      {loading && <p>Loading character...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && data && (
        <div className="character-detail">
          <h1>{data.name}</h1>

          <img
            src={data.image}
            alt={data.name}
            width="200"
          />

          <p>Gender: {data.gender}</p>
          <p>Origin: {data.origin}</p>
          <p>Location: {data.location}</p>
          <p>Episodes: {data.episodes}</p>
        </div>
      )}

      <Link to="/" className="back-button">Back to Characters</Link>
    </div>
    )
}

export default Character;