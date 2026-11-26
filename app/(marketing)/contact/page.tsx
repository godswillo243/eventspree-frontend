const ContactPage = () => {
  return (
    <div className="w-full p-6 flex flex-col items-center justify-center gap-4">
      <h1 className="heading-1">Get in touch</h1>
      <p className="prose-default">
        Have a question, feedback, or need help with a booking? We'd love to
        hear from you.{" "}
      </p>

      <div className="w-full flex flex-wrap justify-center gap-6">
        <form className="w-full max-w-sm flex flex-col gap-4 mt-4">
          <div>
            <label className="label">Name</label>
            <input className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" placeholder="Your email" />
          </div>
          <div>
            <label className="label">Subject</label>
            <input className="input" placeholder="What is this about?" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              className="input min-h-28"
              placeholder="Tell us more..."
            />
            <button className="button-primary w-full mt-2"> Send </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
