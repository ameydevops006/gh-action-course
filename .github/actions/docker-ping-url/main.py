import os
import time
import requests

def ping_url(url, delay, max_trials):
    trial = 0
    while trial < max_trials:
       try:
          response = requests.get(url)
          if response.status_code == 200:
                print(f"Website {url} is reachable.")
                return True

       except requests.ConnectionError:
            print(f"Website {url} is not reachable. Retrying in {delay} seconds...")    
            time.sleep(delay)
            trial += 1

       except requests.exceptions.MissingSchema:
            print(f"Invalid URL: {url}. Please provide a valid URL.")
            return False

    return False


def run():
    website_url = os.getenv("INPUT_URL")
    delay = int(os.getenv("INPUT_DELAY"))
    max_trials = int(os.getenv("INPUT_MAX_TRIALS"))
    website_reachable = ping_url(website_url, delay, max_trials)

    if not website_reachable:
        raise Exception(f"Website {website_url} is not reachable after {max_trials} trials.")

    print(f"Website {website_url} is reachable.")

if __name__ == "__main__":
    run()