import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 items-stretch"
            >
                {/* input */}
                <input
                    type="text"
                    className="flex-1 rounded-md border border-gray-300 focus:border-green-600 focus:ring-0 px-4 py-2 placeholder-gray-400"
                    placeholder="Enter new category"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />

                {/* button */}
                <button
                    type="submit"
                    className="sm:w-auto w-full rounded-md bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2"
                >
                    Create
                </button>
            </form>

        </>
    )
}

export default CategoryForm;