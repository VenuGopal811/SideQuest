SideQuest Backend — PRD v1.0
Objective
Replace the hardcoded 25-quest pool in src/services/questService.ts with a live FastAPI backend that serves quests dynamically.

Scope
Backend only. No Firebase changes. No new RN screens. Frontend change is limited to one file: questService.ts.

Deliverables
1. FastAPI App (backend/)
Endpoints:
MethodPathDescriptionGET/healthReturns {"status": "ok"}GET/quests/randomReturns one random questGET/quests/random?category=fitnessRandom quest filtered by categoryGET/quests?limit=10Returns N quests (default 10, max 50)
Quest schema (response):
json{
  "id": "string (uuid4)",
  "title": "string",
  "description": "string",
  "category": "fitness | social | creative | productivity | challenge",
  "difficulty": "easy | medium | hard",
  "xp_reward": 10 | 25 | 50
}
XP mapping: easy → 10, medium → 25, hard → 50.

2. Quest Data (backend/data/quests.json)
Minimum 60 quests. 12 per category. Each category must have 4 easy, 4 medium, 4 hard.
Categories:

fitness — physical activity quests
social — interaction/people quests
creative — art/writing/music quests
productivity — focus/work/learning quests
challenge — adrenaline/discomfort-zone quests


3. Project Structure
backend/
├── main.py
├── requirements.txt
├── routers/
│   └── quests.py
├── models/
│   └── quest.py          # Pydantic models
├── data/
│   └── quests.json
└── services/
    └── quest_service.py  # load + filter + random logic

4. Frontend Change (src/services/questService.ts)

Replace the hardcoded array with a fetch() call to API_BASE_URL/quests/random
Add src/config/api.ts with API_BASE_URL (LAN IP for dev, placeholder for prod)
Graceful fallback: if fetch fails, return one quest from a local fallback array of 5 quests (not 25)


Out of Scope (today)

Auth headers on API calls
Leaderboard endpoints
Deployment (Fly.io / Railway)
Docker changes


Acceptance Criteria

uvicorn main:app --reload runs without errors
GET /quests/random returns a valid quest object every time
GET /quests/random?category=fitness only returns fitness quests
RN app fetches from backend when server is running
RN app doesn't crash when server is off (fallback works)



implement one file at a time, do not add anything outside the PRD scope.