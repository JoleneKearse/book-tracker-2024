interface Author {
  name: string;
}

interface Cover {
  medium?: string;
}

interface ApiResponse {
  title: string;
  authors?: Author[];
  publish_date?: string;
  publishedDate?: string;
  number_of_pages?: number;
  pageCount?: number;
  cover?: Cover;
  imageLinks?: Cover;
}

interface Book {
  id?: number;
  title: string;
  author: string;
  published: string;
  pages: number | undefined;
  coverImageUrl?: string;
}

export async function fetchBookByIsbn(isbn: string): Promise<Book> {
  try {
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);
    const data = await response.json();
    // console.log(data);
    const bookDetails: ApiResponse | undefined = data[`ISBN:${isbn}`]; 
    // console.log("************************************");
    if (!bookDetails) {
      console.log("Book not found");
      return null as unknown as Book;
    }
    
    const bookData: Book = {
      title: bookDetails?.title,
      author: bookDetails?.authors.map(a => a.name).join(", "),
      published: bookDetails?.publish_date,
      pages: bookDetails?.number_of_pages,
      coverImageUrl: bookDetails?.cover?.medium,
    }
    return bookData;
  } catch (error) {
    console.log(error);
    return null as unknown as Book;
  }
}

export async function fetchBookByTitle(title: string): Promise<Book | null>{
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}`);
    const data = await response.json();
    console.log(data["items"][0]["volumeInfo"]);
    const bookDetails: ApiResponse | undefined = data["items"][0]["volumeInfo"];
    if (!bookDetails) {
      console.log("Book not found");
      return null as unknown as Book;
    }
    const bookData: Book = {
      title: bookDetails?.title,
      author: bookDetails?.authors.map(a => a.name).join(", "),
      published: bookDetails?.publishedDate,
      pages: bookDetails?.pageCount,
      coverImageUrl: bookDetails?.imageLinks?.thumbnail,
    }
    return bookData;
  } catch (error) {
    console.log(error);
    return null as unknown as Book;
  }
}
