import ExperienceGrid from "@/components/ExperienceGrid";
import { createClient } from '@supabase/supabase-js';
// import { fetchHtml } from './src/components/FetchHtml.tsx';
// import { geminiParse } from './src/components/GeminiParse.tsx';

const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-muted py-4">
        <div className="container">
          <h1 className="text-2xl font-bold text-primary">FN Discovery</h1>
          <p className="text-muted-foreground">Track and analyze experiences in real-time</p>
        </div>
      </header>
      <main className="py-8">
        <ExperienceGrid />
      </main>
    </div>
  );
};
// const app = express();
// cron.schedule('* * * * *', async () => { 
//   try {
//       const html = await fetchHtml('your-website.com');
//       const extractedData = await geminiParse(html);

//       const { error } = await supabase
//           .from('fn-discovery')
//           .insert(extractedData);

//       if (error) {
//           console.error('Error inserting data into Supabase:', error);
//       } else {
//           console.log('Data inserted into Supabase successfully!');
//       }
//   } catch (error) {
//       console.error('Error in main process:', error);
//   }
// });

// app.listen(3000, () => console.log('Server started')); 

export default Index;