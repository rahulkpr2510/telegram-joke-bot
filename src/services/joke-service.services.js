import axios from "axios";

export async function fetchJoke() {
  const { data } = await axios.get(
    "https://official-joke-api.appspot.com/random_joke"
  );
  return `${data.setup}\n\n${data.punchline}`;
}
