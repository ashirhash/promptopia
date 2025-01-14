import Link from "next/link";
import { CloudIcon, CrossIcon } from "./ui/Icons";

const Form = ({ type, post, setPost, submitting, handleSubmit }: any) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    if (selectedFiles.length === 0) return;

    const validFiles = selectedFiles.filter((file) => file.size < 500 * 1024);

    if (validFiles.length === 0) {
      alert("Please select images smaller than 500 KB.");
      return;
    }

    const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    // uncomment to enable multifile upload functionality
    // setPost((prevPost: any) => ({
    //   ...prevPost,
    //   images: [...(prevPost.images || []), ...selectedFiles], // append temporary image URLs
    //   imageUrls: [...(prevPost.imageUrls || []), ...imageUrls]
    // }));
    setPost((prevPost: any) => ({
      ...prevPost,
      images: [selectedFiles[0]], // append temporary image URLs
      imageUrls: [imageUrls[0] || prevPost.imageUrls?.[0]],
    }));
  };

  const handleDeleteImage = (index: number) => {
    setPost((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, number: number) => number !== index),
      imageUrls: prev.imageUrls.filter(
        (_: any, number: number) => number !== index
      ),
    }));
  };

  return (
    <section className="w-full max-w-full flex flex-col justify-start">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Prompt</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-screen-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Post Title {" "}
            <span className="text-sm after:text-gray-500">
              (max 80 characters)
            </span>
          </span>
          <input
            maxLength={80}
            value={post.title}
            onChange={(e) =>
              setPost({
                ...post,
                title: e.target.value,
              })
            }
            placeholder="Write your title here..."
            required
            className="form_input"
          />
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Your Awesome AI Prompt
          </span>

          <textarea
            value={post.prompt}
            onChange={(e) =>
              setPost({
                ...post,
                prompt: e.target.value,
              })
            }
            placeholder="Write your prompt here..."
            required
            className="form_textarea"
          />
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Tag {` `}
            <span className="text-sm after:text-gray-500">
              (product, webdevelopment, idea)
            </span>
          </span>

          <input
            value={post.tag}
            onChange={(e) =>
              setPost({
                ...post,
                tag: e.target.value,
              })
            }
            placeholder="YourTagHere"
            required
            className="form_input"
          />
        </label>

        <div>
          <span className="font-satoshi font-semibold text-base mb-2 block text-gray-700">
            Snapshot {` `}
          </span>
          <div className="flex flex-col sm:flex-row justify-start gap-3 w-full">
            <label
              htmlFor="dropzone-file"
              className="p-5 flex flex-col sm:flex-row sm:flex-wrap gap-5 items-center justify-around w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 hover:border-gray-400"
            >
              <div className="">
                <div className="flex justify-center">
                  <CloudIcon
                    fillColor="#999"
                    className="mb-1 inline-block mr-2"
                  />
                  <span className="font-semibold mb-2 inline-block text-md text-gray-500 dark:text-gray-400">
                    Click to upload
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG{" "}
                  <span className="font-semibold">(MAX. 500Kb)</span>
                </p>
              </div>

              <input
                id="dropzone-file"
                accept="image/*"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <div className="flex flex-wrap gap-1">
              {post.imageUrls.map((image: string, index: number) => {
                return (
                  // delete the image on click of this wrapper
                  <div
                    key={`images-${index}`}
                    className=" relative z-0 cursor-pointer overflow-hidden rounded-md"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <CrossIcon
                      fillColor="#fff"
                      className="absolute top-0 left-0 z-10 opacity-0 transition hover:opacity-80 w-full h-full p-5 bg-red-600"
                    />
                    <img
                      className="max-w-24 aspect-square relative z-0  object-cover"
                      src={image}
                      alt="thumbnail image"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Prompt Details{" "}
            <span className="text-sm after:text-gray-500">(in .md)</span>
          </span>
          <textarea
            maxLength={1000}
            value={post.md}
            onChange={(e) =>
              setPost({
                ...post,
                md: e.target.value,
              })
            }
            placeholder="Write your title here..."
            required
            className="form_textarea"
          />
        </label>

        <div className="flex justify-end items-center mb-5 gap-4">
          <Link href="/" className="text-gray-600 md:text-base text-sm">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 md:text-base text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `${type}...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
