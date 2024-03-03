import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SupabaseProvider, useSupabase } from "./context/SupabaseContext";
import { Book, NavLink } from "./types";
import AddBookPage from "./pages/AddBookPage";
import BooksReadPage from "./pages/BooksReadPage";
import BooksSearchPage from "./pages/BooksSearchPage";
// import User from "/user.svg";
import AddBook from "/addBook.svg";
import ViewBook from "/viewBook.svg";
import SearchBook from "/searchBook.svg";

const App: React.FC = () => {
  const navLinks: NavLink[] = [
    // {
    //   name: "User",
    //   path: "/user",
    //   icon: User,
    //   alt: "User",
    // },
    {
      name: "Add Book",
      path: "/",
      icon: AddBook,
      alt: "Add Book",
    },
    {
      name: "Collection",
      path: "/booksRead",
      icon: ViewBook,
      alt: "View Book Collection",
    },
    {
      name: "Search Book",
      path: "/bookSearch",
      icon: SearchBook,
      alt: "Search Books",
    },
  ];

  const [searchedBook, setSearchedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [bookNotFound, setBookNotFound] = useState(false);
  const [addBook, setAddBook] = useState(true);
  const supabase = useSupabase();

  const handleAddBook = (newBook: Book) => {
    setBooks([...books, newBook]);
  };

  const handleConfirmBook = async () => {
    if (searchedBook) {
      const { data, error } = await supabase.from("books").insert([
        {
          title: searchedBook.title,
          author: searchedBook.author,
          published: searchedBook.published,
          pages: searchedBook.pages,
          cover_img_url: searchedBook.coverImageUrl,
          date_finished: searchedBook.dateFinished,
        },
      ]);
      handleAddBook(searchedBook);

      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Data:", data);
      }
      setSearchedBook(null);
    }
  };

  const handleManuallyAddBook = async (newBook: Book) => {
    if (newBook) {
      const { data, error } = await supabase.from("books").insert([
        {
          title: newBook.title,
          author: newBook.author,
          published: null,
          pages: null,
          cover_img_url: null,
          date_finished: newBook.dateFinished,
        },
      ]);
      handleAddBook(newBook);

      if (error) {
        console.log("Error:", error);
      } else {
        setAddBook(false);
      }
    }
  };

  const handleCancelBook = () => {
    // discard selection
    if (searchedBook) {
      setTimeout(() => {
        setSearchedBook(null);
      }, 500);
    }
    setSearchedBook(null);
  };

  const handleSearch = async (book: Book) => {
    // console.log(book);
    setSearchedBook(book);
  };

  const handleDataFetch = async () => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) {
      console.log("Error:", error);
    } else {
      // handleAddBook(data as unknown as Book);
      // {
      //   data.map((book) => handleAddBook(book));
      // }
      // setBooks(data);
      // reverse the books array
      setBooks(data.reverse());
    }
  };

  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AddBookPage
                books={books}
                handleAddBook={handleAddBook}
                navLinks={navLinks}
                handleCancelBook={handleCancelBook}
                handleConfirmBook={handleConfirmBook}
                searchedBook={searchedBook}
                handleSearch={handleSearch}
                bookNotFound={bookNotFound}
                setBookNotFound={setBookNotFound}
                handleManuallyAddBook={handleManuallyAddBook}
                onSearch={handleSearch}
                addBook={addBook}
              />
            }
          />
          <Route
            path="/booksRead"
            element={
              <BooksReadPage
                books={books}
                navLinks={navLinks}
                handleDataFetch={handleDataFetch}
              />
            }
          />
          <Route
            path="/bookSearch"
            element={
              <BooksSearchPage
                books={books}
                navLinks={navLinks}
              />
            }
          />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
};

export default App;
