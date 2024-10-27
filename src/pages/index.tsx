import AutocompleteInput from "@/components/AutocompleteInput";

const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="mb-4 text-3xl font-bold">
        Stock Search App
      </div>
      <AutocompleteInput />
    </div>
  );
}

export default Home;
