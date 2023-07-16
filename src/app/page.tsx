

/* eslint-disable react-hooks/exhaustive-deps */

'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import './globals.css'
import { createClient } from "pexels";
const client = createClient("he2jl8b9JSBTrxZp9QbCc708v5dJYm8srZcUatykMDtFEvblABo8gBMk");
const perPage = 16;

const Home = () => {
  const [page, setPage] = useState(1);
  const [pictures, setPictures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = ["Nature", "Travel", "Food", "Animals", "Architecture"];

  const loadMoreImages = async () => {
    try {
      setLoading(true);
      const response: any = await client.photos.curated({ per_page: perPage, page: page + 1 });
      const newPictures = response.photos.map((photo: any) => ({
        ...photo,
        category: categories[Math.floor(Math.random() * categories.length)], // Assign a random category to each image
        liked: false, // Add the liked property and set it to false initially
      }));
      setPictures((prevPictures) => [...prevPictures, ...newPictures]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading more images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
      loadMoreImages();
    }
  };

  const handleSearchInputChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response: any = await client.photos.search({ query: searchQuery, per_page: perPage });
      const searchResults = response.photos.map((photo: any) => ({
        ...photo,
        category: categories[Math.floor(Math.random() * categories.length)], // Assign a random category to each image
        liked: false, // Add the liked property and set it to false initially
      }));
      setPictures(searchResults);
      setPage(1);
      setSelectedCategory("");
    } catch (error) {
      console.error("Error searching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLike = (id: number) => {
    setPictures((prevPictures) => {
      return prevPictures.map((pic) => {
        if (pic.id === id) {
          return {
            ...pic,
            liked: !pic.liked, // Toggle the liked property
          };
        }
        return pic;
      });
    });
  };

  const filteredPictures = selectedCategory
    ? pictures.filter((pic) => pic.category === selectedCategory)
    : pictures;

  useEffect(() => {
    const fetchPictures = async () => {
      const response: any = await client.photos.curated({ per_page: perPage });
      const initialPictures = response.photos.map((photo: any) => ({
        ...photo,
        category: categories[Math.floor(Math.random() * categories.length)], // Assign a random category to each image
        liked: false, // Add the liked property and set it to false initially
      }));
      setPictures(initialPictures);
    };
    fetchPictures();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

function reload() {
  window.location.reload();
}

  useEffect(() => {
    setPictures([]);
    setPage(1);
  }, [searchQuery]);

  return (
    <main>
      <h1 style={{ textAlign: "center", color: "blue" }} onClick={reload}>Image Gallery</h1>
      <form onSubmit={handleSearchSubmit}>
        <input type="text" value={searchQuery} onChange={handleSearchInputChange} />
        <button type="submit">Search</button>
      </form>
      <div>
        <p>Filter by Category:</p>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryFilter(category)}
            style={{ marginRight: "10px" }}
          >
            {category}
          </button>
        ))}
        <button onClick={() => handleCategoryFilter("")}>All</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {filteredPictures.map((pic: any) => (
          <div key={pic.id} style={{ margin: "10px" }}>
            <Image
              src={pic.src.original}
              alt={pic.alt}
              height={200}
              width={200}
              onLoad={(e:any) => e.target.classList.remove('blur-image')}
              onClick={() => handleLike(pic.id)} // Add the onClick event handler to toggle the liked property
              style={{ cursor: "pointer" }} // Add cursor style to indicate the image is clickable
            />
            <p>Category: {pic.category}</p>
            <p>
            Liked:{" "}
              <span style={{ color: pic.liked ? "green" : "red" }}>
                {pic.liked ? "Yes" : "No"}
              </span>
            </p>
          </div>
        ))}
      </div>
      {loading && <p>Loading more images...</p>}
    </main>
  );
};

export default Home;

