'use client';

import { useState } from 'react';
import { useGetPagesQuery, useCreatePageMutation, useUpdatePageMutation } from '@/store/apiSlice';

export default function PagesAdmin() {
  const { data: pages, isLoading, refetch } = useGetPagesQuery();
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();

  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', blocks: [] as any[] });

  const handleEdit = (page: any) => {
    setEditingPage(page._id);
    setFormData({ title: page.title, slug: page.slug, blocks: page.blocks || [] });
  };

  const handleCreateNew = () => {
    setEditingPage('new');
    setFormData({ title: '', slug: '', blocks: [] });
  };

  const handleAddBlock = (type: string) => {
    setFormData(prev => ({
      ...prev,
      blocks: [...prev.blocks, { id: Date.now().toString(), type, content: '' }]
    }));
  };

  const handleUpdateBlock = (id: string, newContent: any) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
    }));
  };

  const handleRemoveBlock = (id: string) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      if (editingPage === 'new') {
        await createPage(formData).unwrap();
      } else {
        await updatePage({ id: editingPage, pageData: formData }).unwrap();
      }
      setEditingPage(null);
      refetch();
    } catch (err) {
      console.error('Failed to save page', err);
      alert('Error saving page');
    }
  };

  if (isLoading) return <div>Loading pages...</div>;

  return (
    <div className="pages-admin">
      <div className="header-actions">
        <h1>Pages Management</h1>
        {!editingPage && <button onClick={handleCreateNew} className="btn-primary">Create New Page</button>}
      </div>

      {!editingPage ? (
        <div className="pages-list">
          {pages?.map((page: any) => (
            <div key={page._id} className="page-card">
              <h3>{page.title}</h3>
              <p>Slug: /{page.slug}</p>
              <button onClick={() => handleEdit(page)} className="btn-secondary">Edit</button>
            </div>
          ))}
          {pages?.length === 0 && <p>No pages created yet.</p>}
        </div>
      ) : (
        <div className="page-editor">
          <h2>{editingPage === 'new' ? 'Create Page' : 'Edit Page'}</h2>
          
          <div className="form-group">
            <label>Title</label>
            <input 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              className="full-width"
            />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input 
              value={formData.slug} 
              onChange={e => setFormData({ ...formData, slug: e.target.value })} 
              className="full-width"
            />
          </div>

          <div className="blocks-editor">
            <h3>Content Blocks</h3>
            {formData.blocks.map((block, index) => (
              <div key={block.id} className="block-edit-card">
                <div className="block-header">
                  <span>Type: {block.type}</span>
                  <button onClick={() => handleRemoveBlock(block.id)} className="btn-danger">Remove</button>
                </div>
                {block.type === 'text' && (
                  <textarea 
                    value={block.content} 
                    onChange={e => handleUpdateBlock(block.id, e.target.value)}
                    rows={4}
                  />
                )}
                {block.type === 'equation' && (
                  <input 
                    type="text" 
                    value={block.content} 
                    onChange={e => handleUpdateBlock(block.id, e.target.value)}
                    placeholder="e.g. E = mc^2"
                  />
                )}
                {/* Extend with other block types (table, image, list) as needed */}
                {['list', 'table', 'html', 'markdown'].includes(block.type) && (
                   <textarea 
                   value={typeof block.content === 'string' ? block.content : JSON.stringify(block.content, null, 2)} 
                   onChange={e => handleUpdateBlock(block.id, e.target.value)}
                   rows={4}
                   placeholder={`Enter ${block.type} content...`}
                 />
                )}
              </div>
            ))}
            
            <div className="add-block-actions">
              <button onClick={() => handleAddBlock('text')}>+ Text</button>
              <button onClick={() => handleAddBlock('markdown')}>+ Markdown</button>
              <button onClick={() => handleAddBlock('list')}>+ List</button>
              <button onClick={() => handleAddBlock('table')}>+ Table</button>
              <button onClick={() => handleAddBlock('equation')}>+ Equation</button>
            </div>
          </div>

          <div className="editor-actions">
            <button onClick={handleSave} className="btn-primary">Save Page</button>
            <button onClick={() => setEditingPage(null)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
