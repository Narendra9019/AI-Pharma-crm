from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use the DIRECT_URL you found, replacing [YOUR-PASSWORD] with your actual password
SQLALCHEMY_DATABASE_URL = "postgresql://postgres.gynltkrradxujufeqdsr:Qwerty!28159019@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()