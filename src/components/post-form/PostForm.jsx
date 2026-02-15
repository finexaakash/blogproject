import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function PostForm({ post }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(post?.featuredImage || null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
     
      status: post?.status || "active",
    },
  });
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  // Submit Handler
  const submit = async (data) => {
    if (!userData) return;

    setLoading(true);

    try {
      const file = data.image?.[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

      // update post
      if (post) {
        if (file && post.featuredImage && !String(post.featuredImage).startsWith("http")) {
          await appwriteService.deleteFile(post.featuredImage);
        }
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file?.url || file?.$id || post.featuredImage,userId: userData.$id,authorName: userData.name, 
          
        });

        if (dbPost) navigate(`/post/${dbPost.$id}`);
        return;
      }

      // create post
      const dbPost = await appwriteService.createPost({
        ...data,
        featuredImage: file?.url || file?.$id || "",
        userId: userData.$id,
        authorName: userData.name,
        
      });

      if (dbPost) navigate(`/post/${dbPost.$id}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // slug generator
  const slugTransform = useCallback((value) => {
    return value
      ?.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s]+/g, "-")
      .replace(/\s/g, "-") || "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // image preview
  const imageWatch = watch("image");
  useEffect(() => {
    if (imageWatch?.[0]) {
      setPreview(URL.createObjectURL(imageWatch[0]));
    }
  }, [imageWatch]);

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 border">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        {post ? "Update Post ✏️" : "Create New Post 🚀"}
      </h2>

      <form onSubmit={handleSubmit(submit)} className="grid md:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-5">

          <Input
            label="Title"
            placeholder="Enter post title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

          <Input
            label="Slug"
            placeholder="Auto generated slug"
            {...register("slug", { required: true })}
            onInput={(e) =>
              setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
            }
          />

          <RTE
            label="Content"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-5">

          {/* Upload */}
          <div>
            <Input
              label="Featured Image"
              type="file"
              accept="image/*"
              {...register("image", { required: !post })}
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="relative group">
              <img
                src={preview.startsWith("blob:")
                  ? preview
                  : appwriteService.getFilePreview(preview)}
                alt="preview"
                className="rounded-xl shadow-md transition group-hover:scale-[1.02]"
              />
            </div>
          )}

          {/* Status */}
          <Select
            options={["active", "inactive"]}
            label="Status"
            {...register("status", { required: true })}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold transition rounded-xl
            ${post ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"}
            ${loading && "opacity-70 cursor-not-allowed"}
            `}
          >
            {loading
              ? "Processing..."
              : post
              ? "Update Post"
              : "Publish Post"}
          </Button>

        </div>
      </form>
    </div>
  );
}
