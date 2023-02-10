import openai
import sys
from tika import parser




company_name = sys.argv[1]
job_role = sys.argv[2]
resume_path = sys.argv[3]

raw = parser.from_file(resume_path)

resume = raw['content']

prompt = "My experience is as follows: \n" + resume + "\n\n" + "Write me a cover letter for " + company_name + " as a " + job_role + "."



openai.api_key = "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"

# Set up the model and prompt
model_engine = "text-davinci-003"

# Generate a response
completion = openai.Completion.create(
    engine=model_engine,
    prompt=prompt,
    max_tokens=1024,
    n=1,
    stop=None,
    temperature=0.5,
)

response = completion.choices[0].text
print(response)
sys.stdout.flush()