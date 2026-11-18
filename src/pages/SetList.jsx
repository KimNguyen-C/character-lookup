import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

function SetList(){
    const [loading, setLoading] = useState(true);
    const [data, setData]= useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [info, setInfo] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [retry, setRetry] = useState(0);

    useEffect(()=>{
        let isMounted = true;

        async function fetchData(){
            setLoading(true);
            setError(null);
            try{

                const params = new URLSearchParams({
                    page: page.toString()
                })

                if(search){
                    params.set("name", search)
                }

                if(status){
                    params.set("status", status)
                }

                const response = await fetch(`https://rickandmortyapi.com/api/character?${params}`);

                if(response.status === 404){
                    if (isMounted){
                        setData([]);
                        setInfo({});
                        setLoading(false);
                    }
                    return;
                }

                if(!response.ok){
                    throw new Error("Failed to load character")
                }

                const json = await response.json();

                console.log(json);

                if(isMounted){
                    setData(json.results);
                    setInfo(json.info);
                    setLoading(false);
                }

            }catch(err){
                if(isMounted){
                    setError(err.message)
                    setLoading(false);
                }
            }
        }

        fetchData()

        return ()=>{
            isMounted = false;
        }


    },[page, search, status, retry])

    console.log(data)

    
    const character = data.map((item) => (
  <Link
    to={"/character/" + item.id}
    key={item.id}
    className="character-card"
  >
    <img src={item.image} alt={item.name} />

    <div className="character-info">
      <h2>{item.name}</h2>

      <p className={`status ${item.status.toLowerCase()}`}>
        {item.status}
      </p>

      <p>Species: {item.species}</p>
    </div>
  </Link>
    )   );

    function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
    }



    return (
        <>
           <h1>Character Lookup</h1>
           <div className="search-container">
             <form onSubmit={handleSearch}>
     <input
        type="text"
        placeholder="Search characters..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        />

    <button type="submit">Search</button>
    </form>
    <select
  value={status}
  onChange={(e) => {
    setStatus(e.target.value);
    setPage(1);
  }}
    >
    <option value="">All</option>
  <option value="alive">Alive</option>
  <option value="dead">Dead</option>
  <option value="unknown">Unknown</option>
    </select>
           </div>
            {loading && <p>Loading characters...</p>}
            {!loading && error && (
                <div className= "error-message">
                    <p>{error}</p>

                    <button onClick={() => setRetry(r => r + 1)}>
                    Try Again
                    </button>
                </div>
            )}
            {!loading && !error && data.length == 0 && (
                <h3>No Characters Found!</h3>
            )}
            {!loading && !error && data.length > 0 && (
                <><div className="character-grid">
                    {character}
                </div>
                <div className="pagination">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={!info.prev || loading}
                        >
                            Previous
                        </button>

                        <p>Page {page} of {info.pages || 1}</p>

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={!info.next || loading}
                        >
                            Next
                        </button>
                    </div></>

            )}
        </>
    )
}

export default SetList;