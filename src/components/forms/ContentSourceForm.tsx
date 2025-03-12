import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Config {
  url?: string;
  endpoint?: string;
  params?: { categories?: string; limit?: number };
  subreddit?: string;
  limit?: number;
  max_allowed_size?: string;
}

interface Secrets {
  api_key?: string;
  client_id?: string;
  client_secret?: string;
}

interface SourceData {
  name: string;
  sourceType: "rss" | "news_api" | "reddit" | "pdf";
  config: Config;
  secrets: Secrets;
}

const initialSource: SourceData = {
  name: "",
  sourceType: "rss",
  config: {},
  secrets: {},
};

export default function ContentSourceForm() {
  const [source, setSource] = useState<SourceData>(initialSource);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSource((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSource((prev) => ({
      ...prev,
      config: { ...prev.config, [name]: value },
    }));
  };

  const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSource((prev) => ({
      ...prev,
      secrets: { ...prev.secrets, [name]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify(source, null, 2)); // Debugging alternative to console.log
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow">
      <div>
        <Label>Name</Label>
        <Input type="text" name="name" value={source.name} onChange={handleChange} required />
      </div>

      <div>
      <Label htmlFor="sourceType">Source Type</Label>
<select
  id="sourceType" 
  name="sourceType"
  value={source.sourceType} 
  onChange={handleChange} 
  className="w-full p-2 border rounded"
  aria-label="Select a source type"
  title="Select a source type"
>
  <option value="rss">RSS</option>
  <option value="news_api">News API</option>
  <option value="reddit">Reddit</option>
  <option value="pdf">PDF</option>
</select>

      </div>

      <div>
        <Label>Configuration</Label>
        {source.sourceType === "rss" && (
          <Input type="text" name="url" value={source.config.url || ""} onChange={handleConfigChange} placeholder="RSS Feed URL" required />
        )}
        {source.sourceType === "news_api" && (
          <>
            <Input type="text" name="endpoint" value={source.config.endpoint || ""} onChange={handleConfigChange} placeholder="API Endpoint" required />
            <Input type="text" name="categories" value={source.config.params?.categories || ""} onChange={(e) =>
              setSource((prev) => ({
                ...prev,
                config: { ...prev.config, params: { ...prev.config.params, categories: e.target.value } },
              }))
            } placeholder="Categories" />
          </>
        )}
        {source.sourceType === "reddit" && (
          <>
            <Input type="text" name="subreddit" value={source.config.subreddit || ""} onChange={handleConfigChange} placeholder="Subreddit Name" required />
            <Input type="number" name="limit" value={source.config.limit || 1} onChange={handleConfigChange} placeholder="Limit" />
          </>
        )}
        {source.sourceType === "pdf" && (
          <Input type="text" name="max_allowed_size" value={source.config.max_allowed_size || ""} onChange={handleConfigChange} placeholder="Max Allowed Size (MB)" required />
        )}
      </div>

      {["news_api", "reddit"].includes(source.sourceType) && (
        <div>
          <Label>Secrets</Label>
          {source.sourceType === "news_api" && (
            <Input type="text" name="api_key" value={source.secrets.api_key || ""} onChange={handleSecretChange} placeholder="API Key" required />
          )}
          {source.sourceType === "reddit" && (
            <>
              <Input type="text" name="client_id" value={source.secrets.client_id || ""} onChange={handleSecretChange} placeholder="Reddit Client ID" required />
              <Input type="text" name="client_secret" value={source.secrets.client_secret || ""} onChange={handleSecretChange} placeholder="Reddit Client Secret" required />
            </>
          )}
        </div>
      )}

      <Button type="submit" variant="default">Save Source</Button>
    </form>
  );
}
