import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { deleteMaterial, getImage, getMaterialByCourseId } from '../apiConfig';
import Tabel from '../Components/Utilities/Table';
import { toMonthDayYear } from '../utilities/date';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ViewMaterial = () => {
  const [material, setMaterial] = useState(null);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const { isStudent } = useSelector(state => state.users);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['materials', id], 
    queryFn: () => getMaterialByCourseId(id),
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: 1
  });

  const handleEdit = (material) => {
    navigate(`/educator/materials/edit/${id}`, { state: { material } });
  };

  const handleDelete = async (materialId) => {
    try {
      await deleteMaterial(materialId);
      toast.success('Material Deleted Successfully');
      await queryClient.invalidateQueries({ queryKey: ['materials', id] });
      setMaterialToDelete(null);
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  const handleBack = () => {
    navigate('/educator/courses');
  };

  const headers = [
    { label: 'SrNo', align: 'left' },
    { label: 'Material Title', align: 'left' },
    { label: 'Description', align: 'left' },
    { label: 'URL', align: 'left' },
    { label: 'Upload Date', align: 'center', width: '120px' },
    { label: 'Content Type', align: 'center', width: '120px' },
    { label: 'Actions', align: 'center' }
  ];

  const renderMaterials = (material, idx) => (
    <tr key={material._id}>
      <td>{idx + 1}</td>
      <td>{material.title}</td>
      <td className="tooltip tooltip-right max-w-xs" data-tip={material.description}>
        {material.description.slice(0, 50)}
        {material.description.length > 50 && '...'}
      </td>
      <td>
        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary"
        >
          View Link
        </a>
      </td>
      <td>{toMonthDayYear(material.uploadDate)}</td>
      <td>
        <span className="badge badge-primary">{material.contentType}</span>
      </td>
      <td className="flex gap-2 justify-center">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setMaterial({ material, idx })}
        >
          View
        </button>
        {!isStudent && (
          <>
            <button
              onClick={() => handleEdit(material)}
              className="btn btn-sm btn-warning btn-ghost"
              title="Edit Material"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setMaterialToDelete(material)}
              className="btn btn-sm btn-error btn-ghost"
              title="Delete Material"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </td>
    </tr>
  );

  return (
    <div className="mx-auto my-4">
      <div className="bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Materials</h1>
              <p className="mt-1 text-sm text-gray-500">Manage all course materials</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-primary badge-lg">
                {data?.length || 0} Total
              </div>
              <button
                onClick={handleBack}
                className="btn btn-secondary btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <Tabel
                loading={isLoading}
                data={data || []}
                headers={headers}
                renderRow={renderMaterials}
              />
            </div>
          </div>
        </div>
      </div>

      {material && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl p-0 overflow-hidden">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 bg-base-100 hover:bg-base-200"
              onClick={() => setMaterial(null)}
            >
              ✕
            </button>

            <div className="relative w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/10">
              <img
                src={getImage(material.material.file)}
                alt={material.material.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-primary badge-sm">
                    {material.material.contentType}
                  </span>
                  <span className="badge badge-accent badge-sm text-white">
                    New
                  </span>
                </div>
                <h3 className="font-bold text-2xl text-white drop-shadow-lg">
                  {material.material.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h4 className="font-semibold text-lg">Description</h4>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  {material.material.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="text-sm font-medium text-base-content/60">Content Type</span>
                  </div>
                  <p className="font-semibold capitalize">{material.material.contentType}</p>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-sm font-medium text-base-content/60">Resource Link</span>
                  </div>
                  <a
                    href={material.material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-focus font-semibold text-sm truncate block"
                  >
                    View Resource →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop bg-black/50 backdrop-blur-sm" onClick={() => setMaterial(null)}></div>
        </div>
      )}

      {materialToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete <strong>{materialToDelete.title}</strong>?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setMaterialToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDelete(materialToDelete._id)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setMaterialToDelete(null)}></div>
        </div>
      )}
      <span style={{ display: 'none' }}>Logout</span>
    </div>
  );
};

export default ViewMaterial;