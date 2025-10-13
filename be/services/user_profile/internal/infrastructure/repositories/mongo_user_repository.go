package repositories

import (
	"context"
	"fmt"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/entities"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/repositories"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type mongoUserRepository struct {
	collection *mongo.Collection
}

func NewMongoUserRepository(db *mongo.Database) repositories.UserRepository {
	return &mongoUserRepository{
		collection: db.Collection("user_profiles"),
	}
}

func (r *mongoUserRepository) InsertOne(ctx context.Context, user *entities.User) (int64, error) {
	result, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		return 0, err
	}
	insertedID, ok := result.InsertedID.(int64)
	if !ok {
		return 0, nil
	}
	return insertedID, nil
}

func (r *mongoUserRepository) FindByID(ctx context.Context, id string) (*entities.User, error) {
	var user entities.User
	err := r.collection.FindOne(ctx, bson.M{"user_id": id}).Decode(&user)
	return &user, err
}

func (r *mongoUserRepository) UpdateByID(ctx context.Context, id string, updateData map[string]interface{}) (int64, error) {
	result, err := r.collection.UpdateOne(ctx, bson.M{"user_id": id}, bson.M{"$set": updateData})
	if err != nil {
		return 0, err
	}
	if result.MatchedCount == 0 {
		return 0, fmt.Errorf("no document found with user_id %s", id)
	}
	if result.ModifiedCount == 0 {
		return 0, nil
	}
	return result.ModifiedCount, nil
}

func (r *mongoUserRepository) FindAll(ctx context.Context) ([]*entities.User, error) {
	cur, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	var users []*entities.User
	for cur.Next(ctx) {
		var u entities.User
		if err := cur.Decode(&u); err != nil {
			return nil, err
		}
		users = append(users, &u)
	}
	return users, nil
}

func (r *mongoUserRepository) DeleteByID(ctx context.Context, id string) (int64, error) {
	result, err := r.collection.DeleteOne(ctx, bson.M{"user_id": id})
	if err != nil {
		return 0, err
	}
	if result.DeletedCount == 0 {
		return 0, nil
	}
	return result.DeletedCount, nil
}
