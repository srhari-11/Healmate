// Supabase client
const supabaseUrl = "https://aesjzhjfnkmxdvivjaqy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlc2p6aGpmbmtteGR2aXZqYXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTU5MzUsImV4cCI6MjA4Njk5MTkzNX0.ttXhdM1XU_VVQPDdtDEumawzgXqlo-JQtbT1WUO7G1E"; // Replace with your key
const { createClient } = supabase;
const db = createClient(supabaseUrl, supabaseKey);

const messagesDiv = document.getElementById("messages");

// Add message to UI
function addMessage(id, username, content) {
  const currentUser = document.getElementById("username").value.trim();

  const div = document.createElement("div");
  div.classList.add("message");
  div.setAttribute("data-id", id);

  if (username === currentUser) {
    div.classList.add("sent");
  } else {
    div.classList.add("received");
  }

  div.innerHTML = `<strong>${username}</strong><br>${content}`;

  if (username === currentUser) {
    const btn = document.createElement("span");
    btn.classList.add("delete-btn");
    btn.textContent = "✖";
    btn.addEventListener("click", () => deleteMessage(id));
    div.prepend(btn);
  }

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send Message
async function sendMessage() {
  const username = document.getElementById("username").value.trim();
  const content = document.getElementById("message").value.trim();
  if (!username || !content) return;

  const { error } = await db.from("chat_messages").insert([{ username, content }]);
  if (error) console.error(error);

  document.getElementById("message").value = "";
}

// Load Messages
async function loadMessages() {
  messagesDiv.innerHTML = "";

  const { data, error } = await db
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return console.error(error);

  data.forEach(msg => addMessage(msg.id, msg.username, msg.content));
}

loadMessages();

// Delete Message
async function deleteMessage(id) {
  const { error } = await db.from("chat_messages").delete().eq("id", id);
  if (error) return console.error(error);

  document.querySelector(`[data-id='${id}']`)?.remove();
}

// Realtime listener
db.channel("chat-messages-channel")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "chat_messages" },
    (payload) => addMessage(payload.new.id, payload.new.username, payload.new.content)
  )
  .on(
    "postgres_changes",
    { event: "DELETE", schema: "public", table: "chat_messages" },
    (payload) => document.querySelector(`[data-id='${payload.old.id}']`)?.remove()
  )
  .subscribe();