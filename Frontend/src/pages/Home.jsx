import Navbar from '../components/Navbar';
import FeaturedBooks from '../components/FeaturedBooks';
import Categories from '../components/Categories';
import Footer from '../components/Footer';
import BorrowBookForm from "../components/BorrowBookForm";
import BorrowingDetailList from "../components/BorrowingDetailList";
import Statistics from "../components/Statistics";
import BorrowerList from '../components/BorrowerList';
import { useRef, useState, useEffect } from 'react';

export default function Home() {
    const featuredBooksRef = useRef(null);
    const formRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const status = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(status);
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
    };

    const scrollToFeaturedBooks = () => {
        if (featuredBooksRef.current) {
            featuredBooksRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const scrollToForm = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <div className="home font-sans text-purple-900">
            {/* Navbar */}
            <Navbar onSearch={handleSearch} />

            {/* Hero Section */}
            <section
                id="hero"
                className="w-full h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-300 text-center flex flex-col justify-center items-center animate__animated animate__fadeIn"
            >
                <div className="px-6 max-w-2xl">
                    <h1 className="text-6xl font-extrabold drop-shadow-lg mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                        BiblioHaven 📖
                    </h1>
                    <p className="text-lg mb-6 animate__animated animate__fadeInUp animate__delay-2s">
                        A little heaven for book lovers.
                    </p>
                    {isLoggedIn && (
                        <button
                            className="bg-purple-800 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-pink-400 transition duration-300 animate__animated animate__zoomIn animate__delay-3s"
                            onClick={scrollToFeaturedBooks}
                        >
                            Featured Books
                        </button>
                    )}
                </div>
            </section>

            {/* Bagian bawah ini hanya muncul jika sudah login */}
            {isLoggedIn && (
                <>
                    {/* Featured Books */}
                    <section
                        id="featured"
                        ref={featuredBooksRef}
                        className="py-12 px-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate__animated animate__fadeIn"
                    >
                        <FeaturedBooks searchTerm={searchTerm} />
                    </section>

                    {/* Categories */}
                    <section
                        id="categories"
                        className="py-12 px-4 bg-gradient-to-br from-pink-100 via-indigo-100 to-purple-100 animate__animated animate__fadeIn animate__delay-1s"
                    >
                        <Categories searchTerm={searchTerm} />
                    </section>

                    {/* Borrow Book Form */}
                    <section
                        id="form"
                        ref={formRef}
                        className="py-12 px-4 bg-gradient-to-br from-pink-100 via-indigo-100 to-purple-100 animate__animated animate__fadeIn animate__delay-1s"
                    >
                        <BorrowBookForm />
                    </section>

                    {/* Borrowing Detail List */}
                    <section
                        id="borrowings"
                        className="py-12 px-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate__animated animate__fadeIn animate__delay-1s"
                    >
                        <BorrowingDetailList />
                    </section>

                    {/* Statistics */}
                    <section
                        id="statistics"
                        className="py-12 px-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate__animated animate__fadeIn animate__delay-1s"
                    >
                        <Statistics />
                    </section>

                    {/* Borrower List */}
                    <section
                        id="borrower"
                        className="py-12 px-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate__animated animate__fadeIn animate__delay-1s"
                    >
                        <BorrowerList />
                    </section>
                </>
            )}

            {/* Footer tetap muncul */}
            <Footer onCreateClick={scrollToForm} />
        </div>
    );
}
