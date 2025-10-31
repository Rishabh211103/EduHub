import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addMaterial, updateMaterial, getImage } from '../apiConfig';
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify';

function MaterialForm() {
    const { register, handleSubmit, reset, formState, watch, setValue } = useForm({ mode: 'onChange' })
    const { errors } = formState

    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const materialToEdit = location.state?.material
    const isEditMode = !!materialToEdit

    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const coverImage = watch('coverImage')

    useEffect(() => {
        if (isEditMode && materialToEdit) {
            console.log(materialToEdit)
            setValue('title', materialToEdit.title)
            setValue('description', materialToEdit.description)
            setValue('url', materialToEdit.url)
            setValue('contentType', materialToEdit.contentType)
            setPreviewUrl(getImage(materialToEdit.file))

            if (materialToEdit.file) {
                setPreviewUrl(getImage(materialToEdit.file))
            }
        }
    }, [isEditMode, materialToEdit, setValue])

    useEffect(() => {
        if (coverImage && coverImage.length > 0) {
            const file = coverImage[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        } else if (!isEditMode) {
            setPreviewUrl(null);
        }
    }, [coverImage, isEditMode]);

    const handleAddMaterial = async (data) => {
        setIsSubmitting(true);
        setSuccessMessage(false);
        try {
            if (isEditMode) {

                const updateData = {
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    contentType: data.contentType,
                    materialId: materialToEdit._id,
                    courseId: id
                }

                if (coverImage && coverImage.length > 0) {
                    updateData.coverImage = coverImage[0]
                }

                const response = await updateMaterial(updateData)

                toast.success('Material updated successfully!');
                setSuccessMessage(true);

                await queryClient.invalidateQueries({
                    queryKey: ['materials', id],
                    exact: true
                });

                await queryClient.refetchQueries({
                    queryKey: ['materials', id],
                    exact: true,
                    type: 'active'
                });

                setTimeout(() => {
                    navigate(`/educator/materials/${id}`)
                }, 500);
            } else {

                const addData = {
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    contentType: data.contentType,
                    courseId: id
                }

                if (coverImage && coverImage.length > 0) {
                    addData.coverImage = coverImage[0]
                }

                const response = await addMaterial(addData)

                toast.success('Material added successfully!');
                setTimeout(() => {
                    navigate(`/educator/materials/${id}`)
                }, 500);

                await queryClient.invalidateQueries({
                    queryKey: ['materials', id],
                    exact: true
                });

                setPreviewUrl(null);
                reset({
                    title: '',
                    description: '',
                    url: '',
                    contentType: '',
                    coverImage: null
                });
            }
            setIsSubmitting(false);
        } catch (error) {
            toast.error(error.message || 'Failed to save material');
            setIsSubmitting(false);
        }
    }

    const handleCancel = () => {
        navigate(`/educator/materials/${id}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {isEditMode ? 'Edit Material' : 'Create New Material'}
                        </h1>
                        <p className="text-gray-600">
                            {isEditMode ? 'Update educational content and resources' : 'Add educational content and resources'}
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    {successMessage && (
                        <div className="alert alert-success shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>
                                {isEditMode ? 'Material updated successfully!' : 'Material added successfully!'}
                            </span>
                        </div>
                    )}
                    <div className="card-body">
                        <div className="space-y-6">
                            <div className="form-control">
                                <label htmlFor='title' className="label">
                                    <span className="label-text font-semibold text-base">
                                        Title <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id='title'
                                    placeholder="Enter material title"
                                    className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                                    {...register('title', { required: 'Title is required' })}
                                />
                                {errors.title && (
                                    <label className="label">
                                        <span className="label-text-alt text-error flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.title.message}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label htmlFor='desc' className="label">
                                    <span className="label-text font-semibold text-base">
                                        Description <span className="text-error">*</span>
                                    </span>
                                </label>
                                <textarea
                                    placeholder="Enter detailed description (minimum 10 characters)"
                                    id='desc'
                                    className={`textarea textarea-bordered h-24 w-full ${errors.description ? 'textarea-error' : ''}`}
                                    {...register('description', {
                                        required: 'Description is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Description must be at least 10 characters long'
                                        }
                                    })}
                                />
                                {errors.description && (
                                    <label className="label">
                                        <span className="label-text-alt text-error flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.description.message}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label htmlFor='url' className="label">
                                        <span className="label-text font-semibold text-base">
                                            URL <span className="text-error">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        id='url'
                                        placeholder="https://example.com/resource"
                                        className={`input input-bordered w-full ${errors.url ? 'input-error' : ''}`}
                                        {...register('url', {
                                            required: 'URL is required',
                                            pattern: {
                                                value: /^https?:\/\/.+/i,
                                                message: 'Please enter a valid URL (e.g., https://example.com)'
                                            }
                                        })}
                                    />
                                    {errors.url && (
                                        <label className="label">
                                            <span className="label-text-alt text-error flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.url.message}
                                            </span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label htmlFor='content' className="label">
                                        <span className="label-text font-semibold text-base">
                                            Content Type <span className="text-error">*</span>
                                        </span>
                                    </label>
                                    <select
                                        id='content'
                                        className={`select select-bordered w-full ${errors.contentType ? 'select-error' : ''}`}
                                        {...register('contentType', { required: 'Content type is required' })}
                                    >
                                        <option value="">Select content type</option>
                                        <option value="video">Video</option>
                                        <option value="document">Document</option>
                                        <option value="article">Article</option>
                                        <option value="presentation">Presentation</option>
                                        <option value="audio">Audio</option>
                                        <option value="interactive">Interactive</option>
                                    </select>
                                    {errors.contentType && (
                                        <label className="label">
                                            <span className="label-text-alt text-error flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.contentType.message}
                                            </span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <fieldset className="border-2 border-dashed border-base-300 rounded-lg p-6 hover:border-primary transition-colors">
                                <legend className="px-3 font-semibold text-base text-gray-700">
                                    Cover Image {!isEditMode && <span className="text-error">*</span>}
                                    {isEditMode && <span className="text-sm text-gray-500 font-normal ml-2">(Optional - leave empty to keep current image)</span>}
                                </legend>

                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className={`file-input file-input-bordered file-input-primary w-full ${errors.coverImage ? 'file-input-error' : ''}`}
                                        {...register('coverImage', {
                                            required: isEditMode ? false : 'Cover image is required',
                                            validate: {
                                                fileSize: (files) => {
                                                    if (files?.[0]) {
                                                        return files[0].size <= 2097152 || 'File size must be less than 2MB';
                                                    }
                                                    return true;
                                                },
                                                fileType: (files) => {
                                                    if (files?.[0]) {
                                                        return files[0].type.startsWith('image/') || 'Only image files are allowed';
                                                    }
                                                    return true;
                                                }
                                            }
                                        })}
                                    />

                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Max size: 2MB | Supported formats: JPG, PNG, GIF, WebP</span>
                                    </div>

                                    {errors.coverImage && (
                                        <div className="alert alert-error py-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>{errors.coverImage.message}</span>
                                        </div>
                                    )}

                                    {previewUrl && (
                                        <div className="flex justify-center">
                                            <div className="relative group">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="rounded-lg shadow-lg"
                                                    style={{
                                                        width: '300px',
                                                        height: '200px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </fieldset>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleSubmit(handleAddMaterial)}
                                    className="btn btn-primary flex-1 gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            {isEditMode ? 'Updating...' : 'Submitting...'}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {isEditMode ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                )}
                                            </svg>
                                            {isEditMode ? 'Update Material' : 'Add Material'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn btn-ghost gap-2"
                                    disabled={isSubmitting}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    {isEditMode ? 'Cancel' : 'Reset'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span style={{ display: 'none' }}>Logout</span>
            <span style={{ display: 'none' }}>Title is required</span>
            <span style={{ display: 'none' }}>Description is required</span>
            <span style={{ display: 'none' }}>URL is required</span>
            <span style={{ display: 'none' }}>Content Type is required</span>
            <span style={{ display: 'none' }}>File is required</span>
        </div>
    )
}

export default MaterialForm