import Feed from "./Feed";

const Profile = ({
  name,
  desc,
  posts = [],
  handleEdit,
  handleDelete,
}: any) => {
  return (
    <section className="w-full">
      <h1 className="head_text">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc">{desc}</p>

      <Feed posts={posts} handleDelete={handleDelete} handleEdit={handleEdit}/>
    </section>
  );
};

export default Profile;
