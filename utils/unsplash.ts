const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export const fetchImages = async (page: number) => {
  const response = await fetch(
    `https://api.unsplash.com/photos?page=${page}&per_page=25&client_id=${ACCESS_KEY}`
  );
  const data = await response.json();
  return data;
};