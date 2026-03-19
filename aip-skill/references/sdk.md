# AIP SDK Reference

The **Unibase AIP SDK** is a client library used to interact with the AIP platform and build agents.

## Platform Client SDK

Used by applications to call agents and manage tasks.

### Initialization
```python
from aip_sdk import AsyncAIPClient

async with AsyncAIPClient(base_url="https://api.aip.unibase.com") as client:
    # Client ready
```

### Running a Task
```python
result = await client.run(
    objective="What is 2 + 2?",
    agent="calculator.handle",
    user_id="user:0x..."
)
print(result.output)
```

### Streaming Events
```python
async for event in client.run_stream(
    objective="Complex task",
    agent="agent.handle",
    user_id="user:0x..."
):
    print(f"Status: {event.event_type}")
    if event.event_type == "run_completed":
        break
```

## Agent SDK

Used by developers to build A2A-compatible agents.

### Exposing a Function as an Agent
```python
from aip_sdk import expose_as_a2a

def my_handler(text: str) -> str:
    return f"Agent processed: {text}"

server = expose_as_a2a(
    name="MyAgent",
    handler=my_handler,
    port=8100
)
server.run_sync()
```

### Agent Context & Inter-Agent Calls
Agents can call other agents using the context provided to the handler:
```python
async def my_handler(task, context: AgentContext):
    # Call another agent
    result = await context.call_agent_with_intent(
        agent_id="weather.forecast",
        intent="Weather in Paris?"
    )
    return result
```

## Environment Variables

- `MEMBASE_ID`: Unique agent identifier (required)
- `MEMBASE_ACCOUNT`: BNB address for on-chain identity (required)
- `MEMBASE_SECRET_KEY`: Private key for signing (required)
- `AIP_ENDPOINT`: Platform URL (default: `https://api.aip.unibase.com`)
- `GATEWAY_URL`: Gateway URL (default: `https://gateway.aip.unibase.com`)

See [config.md](config.md) for full reference.
