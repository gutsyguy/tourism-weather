const Searchbar = ({
    searchList,
    searchTerm,
    setSearchTerm,
  }: {
    searchList: string[];
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const filteredSearch = searchList.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm ? (
          <div>
            <h2>Search Results:</h2>
            {filteredSearch.map((item, index) => (
              <div key={index}>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div>No results</div>
        )}
      </div>
    );
  };
  
  export default Searchbar;