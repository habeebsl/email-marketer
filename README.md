# Email Marketing Automation Tool

### Thompson Sampling Algorithm Solution

There where a variety of algorithms to choose from, including the UCB and Epsilon-greedy algorithms. They were also good options but they had some randomizing factor to them, which hinders the self-learning algorithm’s progression and balance between exploration & exploitation.

The Thompson Sampling algorithm perfectly balances these aspects, and it’s design allows the model to get better in the long run , hence why I selected it.

**My Solution**:
The model selects the email template to send as well as the ICP to send it to, based on data given. 

### Template and ICP Generation

 We’re making use of a GPT model, coupled with a few prompts to generate a number of templates and ICPs. I added this to make the process feel fully automated and easy to setup. 

### How Everything Would Work

Ideally we would be making use of an API service like [apollo.io](http://apollo.io) to get these ICPs and their data. We’ll be sending a specified number of emails everyday automatically, and for the learning aspect:

- A model we’ll be in charge of generating new email templates, updating existing templates and updating the ICPs, depending on the overall metrics collected every 3-4 days.
- We count link clicks as successes and no clicks as failures.

### Other Ideas

- We could add **email opens** as a metric, but I ultimately decided not to because to do that we would need to add an invisible image to the email in order to track the opens. The problem is that email provider platforms like Gmail and the like, make the user go through an extra step when opening the emails, which makes the email seem suspicious and untrustworthy, hence why I did not include it.

## Tech Stack

**Frontend**: React + Typescript + Zustand + Vite

**Backend**: FastAPI + Python

**Database**: PostgreSQL

**Model**: GPT 4.1

**Algorithm**: Thompson Sampling

## Watch the demo here: 
<div>
    <a href="https://www.loom.com/share/2d2f23e526424e10a144333c75de1ff1">
      <p>Marketing Automation Demo 🚀 - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/2d2f23e526424e10a144333c75de1ff1">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/2d2f23e526424e10a144333c75de1ff1-0122dc52a6b41510-full-play.gif">
    </a>
</div>
