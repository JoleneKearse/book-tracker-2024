import React, { useEffect } from "react";
import { Book, NavLink } from "../types";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import BookCollection from "../components/BookCollection";
import EditBook from "../components/EditBook";

interface BooksReadPageProps {
  navLinks: NavLink[];
  books: Book[];
  handleDataFetch: () => Book[];
  handleEditBook: (book: Book) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editingBook: Book | null;
  setEditingBook: (editedBook: Book | null) => void;
  handleCancelBook: () => void;
  handleConfirmBook: () => void;
}

const BooksReadPage: React.FC<BooksReadPageProps> = ({
  navLinks,
  books,
  handleDataFetch,
  handleEditBook,
  isEditing,
  setIsEditing,
  editingBook,
  setEditingBook,
  handleCancelBook,
  handleConfirmBook,
}) => {
  useEffect(() => {
    handleDataFetch();
  }, []);

  useEffect(() => {
    console.log("isEditing changed in BooksReadPage", isEditing);
    console.log(editingBook);
  }, [isEditing]);

  return (
    <section className="min-h-screen bg-bg-gradient">
      <Header />
      <NavBar navLinks={navLinks} />

      {isEditing && editingBook ? (
        <EditBook
          searchedBook={editingBook}
          handleEditBook={handleEditBook}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
        />
      ) : (
        <BookCollection
          handleDataFetch={handleDataFetch}
          books={books}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          handleEditBook={handleEditBook}
        />
      )}
    </section>
  );
};

export default BooksReadPage;
