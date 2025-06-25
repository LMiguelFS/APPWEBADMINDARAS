// import React, { useEffect, useState } from 'react';

// type Post = {
//     id: number;
//     title: string;
//     content: string;
//     type: string;
//     popularity: number;
//     comments: { content: string }[];
// };

// const ForumAdmin: React.FC = () => {
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [type, setType] = useState('experiencia');
//     const [loading, setLoading] = useState(false);

//     // Cargar publicaciones al iniciar
//     useEffect(() => {
//         cargarPublicaciones();
//     }, []);

//     const cargarPublicaciones = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch('http://127.0.0.1:8000/api/posts');
//             if (!res.ok) throw new Error('No se pudieron cargar las publicaciones');
//             const data = await res.json();
//             setPosts(data);
//         } catch (err: any) {
//             alert(err.message);
//         }
//         setLoading(false);
//     };

//     const crearPublicacion = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const res = await fetch('http://127.0.0.1:8000/api/posts', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//                 body: JSON.stringify({ title, content, type }),
//             });
//             if (!res.ok) throw new Error('Error al crear publicación');
//             setTitle('');
//             setContent('');
//             setType('experiencia');
//             cargarPublicaciones();
//             alert('Publicación creada con éxito');
//         } catch (err: any) {
//             alert(err.message);
//         }
//     };

//     const comentar = async (postId: number, comment: string, cb?: () => void) => {
//         if (!comment.trim()) {
//             alert('Escribe un comentario válido');
//             return;
//         }
//         try {
//             const res = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/comments`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//                 body: JSON.stringify({ content: comment }),
//             });
//             if (!res.ok) throw new Error('Error al comentar');
//             cargarPublicaciones();
//             if (cb) cb();
//         } catch (err: any) {
//             alert(err.message);
//         }
//     };

//     const eliminarPublicacion = async (postId: number) => {
//         if (!window.confirm('¿Seguro que quieres eliminar esta publicación?')) return;
//         try {
//             const res = await fetch(`http://127.0.0.1:8000/api/posts/${postId}`, {
//                 method: 'DELETE',
//                 headers: { 'Accept': 'application/json' },
//             });
//             if (!res.ok) throw new Error('Error al eliminar publicación');
//             cargarPublicaciones();
//         } catch (err: any) {
//             alert(err.message);
//         }
//     };

//     return (
//         <div className="container mx-auto max-w-6xl py-6">
//             <h1 className="mb-4 text-center text-primary text-3xl font-bold">Gestion Foro</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Columna de crear publicación */}
//                 <div>
//                     <h2 className="mb-3 text-xl font-semibold">Crear nueva publicación</h2>
//                     <form className="post bg-white rounded-lg shadow p-4 mb-6" onSubmit={crearPublicacion}>
//                         <div className="mb-3">
//                             <label htmlFor="title" className="form-label font-medium">Título:</label>
//                             <input
//                                 type="text"
//                                 id="title"
//                                 className="form-control w-full border rounded px-3 py-2"
//                                 value={title}
//                                 onChange={e => setTitle(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="content" className="form-label font-medium">Contenido:</label>
//                             <textarea
//                                 id="content"
//                                 rows={4}
//                                 className="form-control w-full border rounded px-3 py-2"
//                                 value={content}
//                                 onChange={e => setContent(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="type" className="form-label font-medium">Tipo:</label>
//                             <select
//                                 id="type"
//                                 className="form-select w-full border rounded px-3 py-2"
//                                 value={type}
//                                 onChange={e => setType(e.target.value)}
//                                 required
//                             >
//                                 <option value="experiencia">Experiencia</option>
//                                 <option value="pregunta">Pregunta</option>
//                                 <option value="consejo">Consejo</option>
//                             </select>
//                         </div>
//                         <button type="submit" className="btn btn-primary">Publicar</button>
//                     </form>
//                 </div>
//                 {/* Columna de publicaciones */}
//                 <div>
//                     <h2 className="mb-3 mt-4 text-xl font-semibold">Publicaciones</h2>
//                     {loading ? (
//                         <div className="text-center py-10 text-gray-500">Cargando publicaciones...</div>
//                     ) : (
//                         <div id="postsContainer">
//                             {posts.map(post => (
//                                 <div key={post.id} className="post bg-white rounded-lg shadow p-4 mb-5">
//                                     <div className="flex justify-between items-center">
//                                         <h4 className="text-lg font-bold">
//                                             {post.title} <small className="text-muted">({post.type})</small>
//                                         </h4>
//                                         <button
//                                             className="btn-delete text-red-600 text-xl font-bold"
//                                             title="Eliminar publicación"
//                                             onClick={() => eliminarPublicacion(post.id)}
//                                         >
//                                             &times;
//                                         </button>
//                                     </div>
//                                     <p className="mt-2">{post.content}</p>
//                                     <div className="mt-2"><strong>Popularidad:</strong> {post.popularity}</div>
//                                     <div className="comments mt-4 pl-4 border-l-4 border-gray-200">
//                                         <h5 className="font-semibold mb-2">Comentarios:</h5>
//                                         {post.comments.length > 0 ? (
//                                             post.comments.map((c, idx) => (
//                                                 <p key={idx} className="mb-1">🗨️ {c.content}</p>
//                                             ))
//                                         ) : (
//                                             <p className="text-muted">No hay comentarios</p>
//                                         )}
//                                         <CommentForm postId={post.id} onComment={comentar} />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const CommentForm: React.FC<{ postId: number; onComment: (postId: number, comment: string, cb?: () => void) => void }> = ({ postId, onComment }) => {
//     const [comment, setComment] = useState('');
//     return (
//         <form
//             className="comment-form mt-3"
//             onSubmit={e => {
//                 e.preventDefault();
//                 onComment(postId, comment, () => setComment(''));
//             }}
//         >
//             <div className="input-group flex">
//                 <input
//                     type="text"
//                     className="form-control flex-1 border rounded-l px-3 py-2"
//                     placeholder="Escribe un comentario"
//                     value={comment}
//                     onChange={e => setComment(e.target.value)}
//                     required
//                 />
//                 <button className="btn btn-outline-primary rounded-r" type="submit">
//                     Comentar
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default ForumAdmin;